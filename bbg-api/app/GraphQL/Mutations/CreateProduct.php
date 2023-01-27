<?php

namespace App\GraphQL\Mutations;

use App\Models\ProductImages;
use App\Models\Products;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateProduct
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $product = new Products;
        $fillableFields = $product->getFillable();
        $argCollection = collect($args);

        foreach ($fillableFields as $field) {
            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
            if($argCollection->has($field)){
                $product->$field = $args[$field];
            }
        }

        $product->save();

        // Deal with files if provided in array
        if(isset($args['files'])) {
            $files = $args['files'];
            $uploaded = [];
            foreach ($files as $file) {
                //$uuid = Str::uuid()->toString();

                //Todo: Handle AWS S3 bucket code or configure in config/filesystem.php
                /*
                 * FOR AWS
                 */
                    $bucket_name = env('AWS_BUCKET');
                    $bucket_region = env('AWS_DEFAULT_REGION');

                    if( empty($bucket_name) || empty($bucket_region) ) {
                        throw new \Exception("missing s3 bucket info");
                    }

                    $uuid = Str::uuid()->toString();
                   $name = $uuid . '.' . $file->getClientOriginalExtension();;
                   $filePath = 'products/'.$name;

                   $fileSave = Storage::disk('s3')->put($filePath, $file->get(), 'public');

                   $url_path = parse_url(Storage::disk('s3')->url($name), PHP_URL_PATH);
//                   $uploaded[] = Storage::disk('products')->putFile($uuid, $file);

                //$uploaded[] = Storage::disk('products')->putFile("", $file);
//                $path = Storage::disk('products')->putFile("", $file);

                ProductImages::query()->create([
                    'product_id' => $product->id,
                        //s3 storage
                    'path' => "https://".$bucket_name.".s3.".$bucket_region.".amazonaws.com/".$filePath,
                        //Local storage
//                    'path' => storage_path("products/".$path),
                    //'created_by' => '',
                    //'updated_by' => ''
                ]);
            }
        }

        return $product;
    }
}
