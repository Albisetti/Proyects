<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use App\Models\User;
use Exception;

class UpdateUserImage
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $user = User::find($args['id']);
        if(!$user) {
            throw new Exception('Tried to update the image for a nonexistent user.');
        }

        if(count($args['image'])) {
            $file = $args['image'][0];

            $stored_filename = $file->storePublicly('uploads');
            $stored_path = storage_path('app/' . $stored_filename);

            $media = new Media;
            $media->model_type = "App\Models\User";
            $media->model_id = $user->id;
            $media->uuid = uniqid();
            $media->collection_name = 'default';
            $media->name = 'user_image';
            $media->mime_type = mime_content_type($stored_path);
            $media->size = filesize($stored_path);
            $media->conversions_disk = "[]";
            $media->manipulations = "[]";
            $media->custom_properties = "[]";
            $media->responsive_images = "[]";
            $media->disk = $stored_path;

            $url = env('APP_URL') . '/public/' . $stored_filename;
            $media->file_name = $url;

            DB::beginTransaction();
            try {
                Media::where('model_type', '=', "App\Models\User")
                    ->where('model_id', '=', $user->id)
                    ->delete();
                $media->save();

                DB::commit();
            } catch(Exception $ex) {
                DB::rollBack();
                return null;
            }

            return $user;
        }

        return null;
    }
}
