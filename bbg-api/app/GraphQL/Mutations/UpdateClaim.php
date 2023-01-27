<?php

namespace App\GraphQL\Mutations;

use App\Models\ClaimFiles;
use App\Models\Claims;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateClaim
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $argCollection = collect($args);
        if(!isset($argCollection['id'])) throw new \Exception("Missing Claim ID");

        $claim = Claims::find($argCollection['id']);
        if(!$claim) throw new \Exception("No Claim found with given ID");

        $fillableFields = $claim->getFillable();

        foreach ($fillableFields as $field) {
            //if (in_array(trim($field), $args)) { => in_array do not work with associative array
            if($argCollection->has($field)){
                $claim->$field = $args[$field];
            }
        }

        $claim->save();

        // Deal with files if provided in array
        if(isset($args['files'])) {
            $files = $args['files'];
            $uploaded = [];
            foreach ($files as $file) {

                /*
                 * FOR AWS
                 */
                $bucket_name = env('AWS_BUCKET');
                $bucket_region = env('AWS_DEFAULT_REGION');

                if( empty($bucket_name) || empty($bucket_region) ) throw new \Exception("missing s3 bucket info");

                $uuid = Str::uuid()->toString();
                $name = $uuid . '.' . $file->getClientOriginalExtension();
                $filePath = 'claims/'.$name;

                $fileSave = Storage::disk('s3')->put($filePath, $file->get(), 'public');

                $url_path = parse_url(Storage::disk('s3')->url($name), PHP_URL_PATH);

                //Local Storage
//                $path = Storage::disk('claims')->putFile("", $file);

                ClaimFiles::query()->create([
                    'claim_id' => $claim->id,
                    //s3 storage
                    'path' => "https://".$bucket_name.".s3.".$bucket_region.".amazonaws.com/".$filePath,
                    //Local storage
//                    'path' => storage_path("claims/".$path),
                    //'created_by' => '',
                    //'updated_by' => ''
                ]);
            }
        }

        if(isset($args['rebateReports'])) {
            foreach( $args['rebateReports'] as $connectionType=>$connectionValues ) {
                switch ( $connectionType ){
                    case 'sync':

                        $inputFields = [];

                        foreach ( $connectionValues as $rebateReportPivotValues ) {

                            if(!isset($rebateReportPivotValues['id'])) throw new \Exception("Missing Id to connect rebate report to claim");
                            //TODO: do we want to check for already set id too?

                            $rebateReportId = $rebateReportPivotValues['id'];
                            unset($rebateReportPivotValues['id']);
                            $inputFields[$rebateReportId] = $rebateReportPivotValues;
                        }

                        $claim->rebateReports()->sync($inputFields);

                        break;

                    case 'syncWithoutDetaching':

                        $inputFields = [];

                        foreach ( $connectionValues as $rebateReportPivotValues ) {

                            if(!isset($rebateReportPivotValues['id'])) throw new \Exception("Missing Id to connect rebate report to claim");
                            //TODO: do we want to check for already set id too?

                            $rebateReportId = $rebateReportPivotValues['id'];
                            unset($rebateReportPivotValues['id']);
                            $inputFields[$rebateReportId] = $rebateReportPivotValues;
                        }

                        $claim->rebateReports()->syncWithoutDetaching($inputFields);

                        break;
                    case 'disconnect':
                        $claim->rebateReports()->detach($connectionValues);
                        break;
                    default:
                        throw new \Exception("Un-handle connection type for claim and rebate report relation");
                }
            }
        }

        return $claim;
    }
}
