<?php

namespace App\GraphQL\Mutations;

use App\Models\Disputes;
use Illuminate\Support\Facades\DB;

class BatchUpdateDispute
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)

    {

        $disputes = collect([]);
        $rebateReports = [];

        DB::beginTransaction();

        try {

            if(isset($args['disputes']) && !empty($args['disputes']) ) {
                foreach ( $args['disputes'] as $disputeArgs ) {
                    $dispute = Disputes::findOrFail($disputeArgs['id']);
                    $fillableFields = $dispute->getFillable();
                    $argCollection = collect($disputeArgs);

                    foreach ($fillableFields as $field) {
                        //if (in_array(trim($field), $args)) { => in_array do not work with associative array
                        if($argCollection->has($field)){
                            $dispute->$field = $disputeArgs[$field];
                        }
                    }

                    $dispute->save(['claimDisconnect'=>false]);

                    if ( isset($disputeArgs['rebateReport']) ){
                        foreach( $disputeArgs['rebateReport'] as $connectionType=>$connectionValues ) {
                            switch ( $connectionType ){
                                case 'connect':
                                    $dispute->rebateReport()->associate($connectionValues);
                                    $rebateReports[] = $connectionValues;
                                    break;
                                case 'disconnect':
                                    $dispute->rebateReport()->dissociate();
                                    break;
                                default:
                                    DB::rollBack();
                                    throw new \Exception("Un-handle connection type for dispute & rebate relation");
                            }
                        }
                        $dispute->save(['claimDisconnect'=>false]);
                    } else {
                        if (!$dispute->exists){
                            //                            throw new \Exception('No RebateReport To connect to provided');
                            continue;
                        }
                        if(isset($dispute->rebateReportHouseProduct_id) && !empty($dispute->rebateReportHouseProduct_id)){
                            $rebateReports[] = $dispute->rebateReportHouseProduct_id;
                        }
                    }

                    if ( isset($disputeArgs['claim']) ){
                        foreach( $disputeArgs['claim'] as $connectionType=>$connectionValues ) {
                            switch ( $connectionType ){
                                case 'connect':
                                    $dispute->claim()->associate($connectionValues);
                                    break;
                                case 'disconnect':
                                    $dispute->claim()->dissociate();
                                    break;
                                default:
                                    DB::rollBack();
                                    throw new \Exception("Un-handle connection type for dispute & claim relation");
                            }
                        }
                        $dispute->save(['claimDisconnect'=>false]);
                    }

                    $dispute->refresh();
                    $disputes->push($dispute);
                }

                if( isset($rebateReports) && !empty($rebateReports) ){
                    DB::delete("delete claim_rebateReport from claim_rebateReport left join claims on claim_rebateReport.claim_id = claims.id where rebateReport_id in ("
                        . collect($rebateReports)->map(function (){
                            return "?";
                        })->implode(',') . ") and status not in ('ready to close','close');", $rebateReports);
                }

                DB::commit();
            }
        } catch (\Exception $ex){
            throw $ex;
        }

        return $disputes;
    }
}
