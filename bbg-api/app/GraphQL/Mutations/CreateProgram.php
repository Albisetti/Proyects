<?php

namespace App\GraphQL\Mutations;

use App\Helpers\WordPressHelpers;
use App\Models\Programs;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Execution\Arguments\ArgPartitioner;
use Nuwave\Lighthouse\Execution\Arguments\ArgumentSet;
use Nuwave\Lighthouse\Execution\Arguments\NestedBelongsTo;
use Nuwave\Lighthouse\Execution\Arguments\NestedMorphTo;
use Nuwave\Lighthouse\Execution\Arguments\ResolveNested;

class CreateProgram
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        //To activate use remove @create directive from schema
        //TODO: incompleted, not being used

        $model = New Programs();

        //keeping $args['files'] in the arg array breaks the function
        if ( isset($args['files']) ) {
            $files = $args['files'];
            unset($args['files']);
        }

        //The following fields need to get added to the ProgramInput.graphql
        if ( isset($args['product_minimum_unit']) ) {
            $product_global_minimum_unit = $args['product_minimum_unit'];
            unset($args['product_minimum_unit']);
        }

        if ( isset($args['product_rebate_amount_type']) ) {
            $product_global_rebate_amount_type = $args['product_rebate_amount_type'];
            unset($args['product_rebate_amount_type']);
        }

        if ( isset($args['product_rebate_residential_amount']) ) {
            $product_global_rebate_residential_amount = $args['product_rebate_residential_amount'];
            unset($args['product_rebate_residential_amount']);
        }

        if ( isset($args['product_rebate_multi_unit_amount']) ) {
            $product_global_rebate_multi_unit_amount = $args['product_rebate_multi_unit_amount'];
            unset($args['product_rebate_multi_unit_amount']);
        }

        if ( isset($args['product_rebate_commercial_amount']) ) {
            $product_global_rebate_commercial_amount = $args['product_rebate_commercial_amount'];
            unset($args['product_rebate_commercial_amount']);
        }

        $argumentSet = new ArgumentSet();
        $argumentSet->arguments = $args;

        // Extract $morphTo first, as MorphTo extends BelongsTo
        [$morphTo, $remaining] = ArgPartitioner::relationMethods(
            $argumentSet,
            $model,
            MorphTo::class
        );

        [$belongsTo, $remaining] = ArgPartitioner::relationMethods(
            $remaining,
            $model,
            BelongsTo::class
        );

//        var_dump($remaining);
        //TODO: toPlain in toArray breaks
//        $argsToFill = $remaining->toArray();

        $plainArguments = [];
        $ManyToMany = [];

        foreach ($remaining->arguments as $name => $argument) {

            var_dump($name);
            var_dump(gettype($argument));
            var_dump($argument);

            if (
                $name == 'products'
                || $name == 'regions'
                || $name == 'organizations'
            ) {
                //TODO: why are these not in relation?
                $ManyToMany[$name] = $argument;
                continue;
            }

            $plainArguments[$name] = $argument;
        }

        die();

        // Use all the remaining attributes and fill the model
        if (config('lighthouse.force_fill')) {
            $model->forceFill($plainArguments);
        } else {
            $model->fill($plainArguments);
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

//        if ($this->parentRelation instanceof HasOneOrMany) {
//            // If we are already resolving a nested create, we might
//            // already have an instance of the parent relation available.
//            // In that case, use it to set the current model as a child.
//            $this->parentRelation->save($model);
//
//            return $model;
//        }

        //TODO: Array to string
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

        //TODO: for some reason Products and such are not in $belongsTo, $morphTo or BelongsToMany in the original
//        if ($this->parentRelation instanceof BelongsToMany) {
//            $this->parentRelation->syncWithoutDetaching($model);
//        }

        if ( !empty($ManyToMany) ) {
            foreach ($ManyToMany as $relation => $connection) {
                if ( $relation == 'products' ) {
                    foreach($connection as $connectionType => $record) {

                        //TODO: $value is array
                        if ($connectionType = "sync") {
                            $syncString = [];

                            foreach ( $record as $value ) {

                                if (isset($product_global_minimum_unit) && (!isset($value['minimum_unit']) || !empty($value['minimum_unit']))) $value['minimum_unit'] = $product_global_minimum_unit;

                                if (isset($product_global_rebate_amount_type) && (!isset($value['rebate_amount_type']) || !empty($value['rebate_amount_type']))) $value['rebate_amount_type'] = $product_global_rebate_amount_type;

                                if (isset($product_global_rebate_residential_amount) && (!isset($value['residential_rebate_amount']) || !empty($value['residential_rebate_amount']))) $value['residential_rebate_amount'] = $product_global_rebate_residential_amount;

                                if (isset($product_global_rebate_multi_unit_amount) && (!isset($value['multi_unit_rebate_amount']) || !empty($value['multi_unit_rebate_amount']))) $value['multi_unit_rebate_amount'] = $product_global_rebate_multi_unit_amount;

                                if (isset($product_global_rebate_commercial_amount) && (!isset($value['commercial_rebate_amount']) || !empty($value['commercial_rebate_amount']))) $value['commercial_rebate_amount'] = $product_global_rebate_commercial_amount;

                                //sync([1 => ['expires' => true], 2, 3]);

                                $syncString[$value['id']] = '';
                            }

                            $model->$relation()->syncWithoutDetaching($string);

                        }
                    }
                }
            }
        }

        // Deal with files if provided in array
        if(isset($files)) {

            $className = 'App\\Models\\ProgramFiles';

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
