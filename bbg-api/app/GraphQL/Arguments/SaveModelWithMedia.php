<?php

namespace App\GraphQL\Arguments;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\Arguments\ArgPartitioner;
use Nuwave\Lighthouse\Execution\Arguments\NestedBelongsTo;
use Nuwave\Lighthouse\Execution\Arguments\NestedMorphTo;
use Nuwave\Lighthouse\Execution\Arguments\ResolveNested;
use Spatie\Image\Image;

// based off of vendor/nuwave/lighthouse/src/Execution/Arguments/SaveModel.php
class SaveModelWithMedia
{
    /**
     * @var \Illuminate\Database\Eloquent\Relations\Relation|null
     */
    protected $parentRelation;

    public function __construct(?Relation $parentRelation = null, $parentFileModel)
    {
        $this->parentRelation = $parentRelation;
        $this->parentFileModel = $parentFileModel;
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  \Nuwave\Lighthouse\Execution\Arguments\ArgumentSet  $args
     */
    public function __invoke($model, $args): Model
    {

        // if "Nuwave\\Lighthouse\\Execution\\Arguments\\ArgPartitioner::nestedArgResolvers(): Argument #1 ($argumentSet) must be of type Nuwave\\Lighthouse\\Execution\\Arguments\\ArgumentSet, array given, called in /var/www/html/vendor/nuwave/lighthouse/src/Execution/Arguments/ResolveNested.php on line 33"
        // then you may have a field or method called file, that cannot happen

        //keeping $args->arguments['medias'] in the arg array breaks the function //TODO: confirm
        if ( isset($args->arguments['images']) ) {
            $medias = $args->arguments['images'];
            unset($args->arguments['images']);
        }

        //Need to strip out manyToMany relation, ex. User's organizations

        // Extract $morphTo first, as MorphTo extends BelongsTo
        [$morphTo, $remaining] = ArgPartitioner::relationMethods(
            $args,
            $model,
            MorphTo::class
        );

        [$belongsTo, $remaining] = ArgPartitioner::relationMethods(
            $remaining,
            $model,
            BelongsTo::class
        );

        $argsToFill = $remaining->toArray();

        // Use all the remaining attributes and fill the model
        if (config('lighthouse.force_fill')) {
            $model->forceFill($argsToFill);
        } else {
            $model->fill($argsToFill);
        }

        foreach ($belongsTo->arguments as $relationName => $nestedOperations) {
            /** @var \Illuminate\Database\Eloquent\Relations\BelongsTo $belongsTo */
            $belongsTo = $model->{$relationName}();
            $belongsToResolver = new ResolveNested(new NestedBelongsTo($belongsTo));
            $belongsToResolver($model, $nestedOperations->value);
        }


        foreach ($morphTo->arguments as $relationName => $nestedOperations) {
            /** @var \Illuminate\Database\Eloquent\Relations\MorphTo $morphTo */
            $morphTo = $model->{$relationName}();
            $morphToResolver = new ResolveNested(new NestedMorphTo($morphTo));
            $morphToResolver($model, $nestedOperations->value);
        }

        if ($this->parentRelation instanceof HasOneOrMany) {
            // If we are already resolving a nested create, we might
            // already have an instance of the parent relation available.
            // In that case, use it to set the current model as a child.
            $this->parentRelation->save($model);

            return $model;
        }

        //TODO: uncomment after completed the media block

        $model->save();

//        if ($this->parentRelation instanceof BelongsTo) {
//            $parentModel = $this->parentRelation->associate($model);
//
//            // If the parent Model does not exist (still to be saved),
//            // a save could break any pending belongsTo relations that still
//            // needs to be created and associated with the parent model
//            if ($parentModel->exists) {
//                $parentModel->save();
//            }
//        }
//
//        if ($this->parentRelation instanceof BelongsToMany) {
//            $this->parentRelation->syncWithoutDetaching($model);
//        }

        // Deal with files if provided in array
        if(isset($medias)) {

            $className = $this->parentFileModel;

            $uploaded = [];
            foreach ($medias->value as $media) {
                //$uuid = Str::uuid()->toString();

                $file = $media->arguments['upload']->value;

                //Todo: Handle AWS S3 bucket code or configure in config/filesystem.php
                /*
                 * FOR AWS
                 */
                $bucket_name = env('AWS_BUCKET');
                $bucket_region = env('AWS_DEFAULT_REGION');

                if( empty($bucket_name) || empty($bucket_region) )  throw new \Exception("missing s3 bucket info");

                $uuid = Str::uuid()->toString();
                $name = $uuid . '.' . $file->getClientOriginalExtension();
                $filePath = class_basename($model) . '/'.$name;

                //temp store image to manipulate it as needed;
                $tempFileSave = Storage::disk('local')->put($filePath, $file->get());

                $tempSpatieImage = Image::load(storage_path('app/'.class_basename($model) . '/'.$name));

                if (
                    isset($media->arguments['maximumWidth'])
                        && isset($media->arguments['maximumHeight'])
                ) {
                $tempSpatieImage->crop(
                    ( isset($media->arguments['cropMethod']) ? $media->arguments['cropMethod']->value : 'crop-center' ),
                    $media->arguments['maximumWidth']->value,
                    $media->arguments['maximumHeight']->value
                );
                }

                $tempSpatieImage->save();

                $fileSave = Storage::disk('s3')->put($filePath, Storage::disk('local')->get($filePath), 'public');

                $url_path = parse_url(Storage::disk('s3')->url($name), PHP_URL_PATH);

                //Delete temp stored image
                $fileDelete = Storage::disk('local')->delete($filePath);

                //Relate new image to model by creating record
                $className::query()->create([
                    $className::getRelationKey() => $model->id,
                    //s3 storage
                    'path' => "https://".$bucket_name.".s3.".$bucket_region.".amazonaws.com/".$filePath,
                    //Local storage
//                    'path' => storage_path("products/".$path),
                    //'created_by' => '',
                    //'updated_by' => ''
                ]);
            }
        }

        return $model;
    }
}

