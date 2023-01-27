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

use App\Models\OrganizationCustomProduct;
use App\Models\Organizations;
use App\Models\Programs;

// based off of vendor/nuwave/lighthouse/src/Execution/Arguments/SaveModel.php
class SaveModelWithFile
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
        //keeping $args->arguments['files'] in the arg array breaks the function
        if ( isset($args->arguments['files']) ) {
            $files = $args->arguments['files'];
            unset($args->arguments['files']);
        }

        if($model->getTable() == "products"
            && isset($args->arguments['organization_id'])
            && isset($args->arguments['program_id']))
        {
            /**
             * TODO: Issue program_id nor program is provided witth product mutation
             * program should at least be available, I think it may be due to the of relation?
             * **/

//            throw new \Exception(json_encode($args->arguments));

            $custom_builder_id = $args->arguments['organization_id'];
            unset($args->arguments['organization_id']);

            if (isset($args->arguments['residential_builder_rebate_amount'])) {
                $residential_rebate_amount = $args->arguments['residential_builder_rebate_amount'];
                unset($args->arguments['residential_builder_rebate_amount']);
            }
            if (isset($args->arguments['multi_unit_builder_rebate_amount'])) {
                $multi_unit_rebate_amount = $args->arguments['multi_unit_builder_rebate_amount'];
                unset($args->arguments['multi_unit_builder_rebate_amount']);
            }
            if (isset($args->arguments['commercial_builder_rebate_amount'])) {
                $commercial_rebate_amount = $args->arguments['commercial_builder_rebate_amount'];
                unset($args->arguments['commercial_builder_rebate_amount']);
            }
        }

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

        if($model->getTable() == "products"
        && isset($custom_builder_id)
        && isset($args->arguments['program_id'])) {
            $organization_id = $custom_builder_id->value;
            $program_id = $args->arguments['program_id']->value;

            unset($args->arguments['organization_id']);
            unset($args->arguments['program_id']);
            unset($model->organization_id);
            unset($model->program_id);

            $builder = Organizations::find($organization_id)->first();
            if(!$builder) {
                throw new \Exception('Trying to create custom product for non-existent builder.');
            }

            $program = Programs::find($program_id)->first();
            if(!$program) {
                throw new \Exception('Trying to create custom product for non-existent program.');
            }

            $model->save();

            $rebate_amount_type = $args->arguments['rebate_amount_type'];

            $custom_product = new OrganizationCustomProduct;
            $custom_product->product_id = $model->id;
            $custom_product->organization_id = $builder->id;
            $custom_product->program_id = $program->id;

            if(isset($rebate_amount_type)) {
                $custom_product->overwrite_amount_type = $rebate_amount_type->value;
            }

            if(isset($residential_rebate_amount)) {
                $custom_product->residential_rebate_overwrite = $residential_rebate_amount->value;
            }

            if(isset($multi_unit_rebate_amount)) {
                $custom_product->multi_unit_rebate_overwrite = $multi_unit_rebate_amount->value;
            }

            if(isset($commercial_rebate_amount)) {
                $custom_product->commercial_rebate_overwrite = $commercial_rebate_amount->value;
            }

            $custom_product->save();
            $model->customization_id = $custom_product->id;
            $model->save();
        } else {
            $model->save();
        }

        if ($this->parentRelation instanceof BelongsTo) {
            $parentModel = $this->parentRelation->associate($model);

            // If the parent Model does not exist (still to be saved),
            // a save could break any pending belongsTo relations that still
            // needs to be created and associated with the parent model
            if ($parentModel->exists) {
                $parentModel->save();
            }
        }

        if ($this->parentRelation instanceof BelongsToMany) {
            $this->parentRelation->syncWithoutDetaching($model);
        }

        // Deal with files if provided in array
        if(isset($files)) {

            $className = $this->parentFileModel;

            $uploaded = [];
            foreach ($files->value as $file) {
                //$uuid = Str::uuid()->toString();

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

                $fileSave = Storage::disk('s3')->put($filePath, $file->get(), 'public');

                $url_path = parse_url(Storage::disk('s3')->url($name), PHP_URL_PATH);

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

