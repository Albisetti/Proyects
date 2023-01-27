<?php

namespace App\GraphQL\Mutations;

use App\Models\ClaimFiles;
use App\Models\ClaimPeriods;
use App\Models\Claims;
use App\Models\ClaimsHouses;
use App\Models\ClaimsProducts;
use App\Models\OrganizationDuePayments;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateClaim
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        DB::beginTransaction();

            $claim = new Claims();
            $fillableFields = $claim->getFillable();
            $argCollection = collect($args);

            foreach ($fillableFields as $field) {
                //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                if($argCollection->has($field)){
                    $claim->$field = $args[$field];
                }
            }

            if( isset($args['program']) ){
                foreach( $args['program'] as $connectionType=>$connectionValues ) {
                    switch ($connectionType) {
                        case 'connect':
                            $claim->program_id = $connectionValues;
                            break;
                        default:
                            DB::rollBack();
                            throw new \Exception("Un-handle connection type");
                    }
                }
            }

        if( isset($args['claim_template']) ){
            foreach( $args['claim_template'] as $connectionType=>$connectionValues ) {
                switch ($connectionType) {
                    case 'connect':
                        if( isset($connectionValues['type']) && isset($connectionValues['id']) && $connectionValues['id'] !== "all" ) {
                            $claim->claim_template_product_type = $connectionValues['type'];
                            $claim->claim_template_product_id = $connectionValues['id'];
                        }
                        break;
                    default:
                        DB::rollBack();
                        throw new \Exception("Un-handle connection type");
                }
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

                        if( empty($bucket_name) || empty($bucket_region) ) {
                            DB::rollBack();
                            throw new \Exception("missing s3 bucket info");
                        }

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

            //Not use in FE currently, Todo: Optimize
            if(isset($args['rebateReports'])) {
                foreach( $args['rebateReports'] as $connectionType=>$connectionValues ) {
                    switch ( $connectionType ){
                        case 'sync':

                            $inputFields = [];

                            foreach ( $connectionValues as $rebateReportPivotValues ) {

                                if(!isset($rebateReportPivotValues['id'])) {
                                    DB::rollBack();
                                    throw new \Exception("Missing Id to connect rebate report to claim");
                                }
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

                                if(!isset($rebateReportPivotValues['id'])) {
                                    DB::rollBack();
                                    throw new \Exception("Missing Id to connect rebate report to claim");
                                }
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
                            DB::rollBack();
                            throw new \Exception("Un-handle connection type for claim and rebate report relation");
                    }
                }
            }

//            if( isset($args['duePayment']) ){
//                foreach( $args['duePayment'] as $connectionType=>$connectionValues ) {
//                    switch ( $connectionType ) {
//                        case 'create':
//                            $duePayment = new OrganizationDuePayments();
//                            if( isset($connectionValues['amount']) ) $duePayment->amount = $connectionValues['amount'];
//                            if( isset($connectionValues['payment_time']) ) $duePayment->payment_time = $connectionValues['payment_time'];
//                            if( isset($connectionValues['status']) ) $duePayment->status = $connectionValues['status'];
//
//                            if( isset($connectionValues['due']) ) {
//                                foreach ($connectionValues['due'] as $connectionType => $connectionValues) {
//                                    switch ($connectionType) {
//                                        case 'connect':
//                                            $duePayment->due_id = $connectionValues;
//                                            break;
//                                        default:
//                                            DB::rollBack();
//                                            throw new \Exception("Un-handle connection type");
//                                    }
//                                }
//                            }
//                            $claim->duePayment()->save($duePayment);
//                            break;
//                        default:
//                            DB::rollBack();
//                            throw new \Exception("Un-handle connection type");
//                    }
//                }
//            }

//        $claim->save();
        $claim->refresh();

        DB::commit();

        return $claim;
    }
}
