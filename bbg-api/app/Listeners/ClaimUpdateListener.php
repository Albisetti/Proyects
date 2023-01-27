<?php

namespace App\Listeners;

use App\Helpers\ConversionHelpers;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClaimUpdateListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        //
        DB::beginTransaction();
        try {

//             Claim and eager loaded reference
//                    $refreshedModel = Claims::where('id',$this->id)
//                        ->with(
//                            [
//                                'rebateReports',
//                                'rebateReports.rebateReports',
//                                'rebateReports.rebateReports.organization',
//                                'rebateReports.rebateReports.organization.programs',
//                                'rebateReports.houses',
//                                'rebateReports.products',
//                                'rebateReports.products.programs',
//                                'rebateReports.products.customization',
//                                'rebateReports.products.organizationOverwrites',
//                                'rebateReports.products.organizationOverwritesProgram',
//                                'rebateReport.dispute'
//                            ]
//                        )
//                        ->get();

            $claim = $event->claim;
            $closing = $event->closing;

            if( $claim->status == 'close' || ($claim->status == 'ready to close' && !$closing ) ){
                throw new \Exception('Closed claims are immutable.');
            }

            $rebateReportPivots = $claim->rebateReports; //RebateReportsHousesProducts
            if($rebateReportPivots->isEmpty()) return; //If no RebateReportsHousesProducts, no calculation needed for factory

            $rebateReportPivotsUpdateString = [];
            $rebateReportPivotsUpdateIds = [];
            $rebateReportPivotsUpdateBuilderAllocations = [];
            $rebateReportPivotsUpdateTotalAllocations = [];

            $disputesUpdateString = [];
            $disputesUpdateIds = [];
            $disputesUpdateBuilderAllocations = [];
//                $disputesUpdateBBGAllocations = [];
            $disputesUpdateTotalAllocations = [];

            /* Values we are accumulating */
            $reporting = [];
            $total_allocation = 0;

            foreach ($rebateReportPivots as $rebateReportPivot){
                $rebateReport = $rebateReportPivot->rebateReports;
                if(!$rebateReport) throw new \Exception('Failed to find reports through pivot.');

                if ( isset($event->builderId) && $rebateReport->organization_id != $event->builderId ) continue;
                //Following is for debugging non-builder claimAllocationCalculation, if you see the id in the Exception then the regular call is somehow getting an organization id.
//                if($rebateReport->organization_id != $event->builderId) throw new \Exception(json_encode($rebateReport->organization_id));

                $organization = $rebateReport->organization;
                if(!$organization) throw new \Exception('Claim rebate report save event without a valid organization.');

                $rebate_report_id = $rebateReport->id;
                $conversions = ConversionHelpers::conversionRevenue();

                $report = $rebateReportPivot->generateReport($conversions,$rebateReportPivot);
                $house_id = $rebateReportPivot->house_id;

                //If rebateReport_house_product as already been calculated
                if(isset($reporting[$rebateReportPivot->id])) {
                    continue;
                }

                $reporting[$rebateReportPivot->id] = $report['result'];

                //DEBUG LINE, to see results from RebateReportsHousesProducts->generateReport
//                if($rebateReportPivot->id==11641) throw new \Exception(json_encode([$rebateReportPivot->id,$report]));

                if (
                    isset($report['dispute']) && !empty($report['dispute'])
                    && isset($report['dispute'][0]) && !empty($report['dispute'][0])
                ) {
                    //If we move back to multi dispute per RebateReportHouseProduct, we will need to loop here
//                    foreach ($report['dispute'] as $dispute){
                    $disputesUpdateString[] = 'when ' . $report['dispute'][0]['dispute_id'] . ' THEN ?';
                    $disputesUpdateIds[] = $report['dispute'][0]['dispute_id'];
                    $disputesUpdateBuilderAllocations[] = $report['dispute'][0]['builder_keeps'];
//                $disputesUpdateBBGAllocations[] = $report['dispute'][0]['base_rebate_amount'] - $report['dispute'][0]['builder_keeps'];
                    $disputesUpdateTotalAllocations[] = $report['dispute'][0]['base_rebate_amount'];
//                    }
                }

                $rebateReportPivotsUpdateString[] = 'when '.$rebateReportPivot->pivot->id.' THEN ?';
                $rebateReportPivotsUpdateIds[] = $rebateReportPivot->pivot->id;
                $rebateReportPivotsUpdateBuilderAllocations[] = round($report['result']['totals']['by_builder'][$organization->id]['total'],2);
//                $rebateReportPivotsUpdateBBGAllocations[] = round($report['result']['totals']['bbg_keep']['total'],2);
                $rebateReportPivotsUpdateTotalAllocations[] = round($report['result']["totals"]["base"]["total"],2);

                $total_allocation +=
                    (isset($report['dispute']) && !empty($report['dispute']) && isset($report['dispute'][0]) && !empty($report['dispute'][0])) ?
                        $report['dispute'][0]['base_rebate_amount']
                        :
                        $report['result']["totals"]["base"]["total"]
                ;
            }

            //The Following is a debug line to get an array of all the reports generated
//            throw new \Exception(json_encode($reporting));

            if ( isset($event->builderId)) {
                $previousTotals = $claim->calculateCurrentTotal(); //TODO: See about maybe skipping the call in this method, call disputes and everything else above and get the calculateCurrentTotal over here too?
                $previousTotal = $previousTotals['total'];
                foreach ($previousTotals['builderTotals'] as $index=>$builderResults){
                    if( $builderResults['builder_id'] == $event->builderId ){
                        $previousBuilderTotal = $previousTotals['builderTotals'][$index];
                        break;
                    }
                }

                $total_allocation += ($previousTotal-(isset($previousBuilderTotal) && isset($previousBuilderTotal['total'])?$previousBuilderTotal['total']:0));
            }

            if ( !empty($rebateReportPivotsUpdateIds) ) {
                /* Assign all claim_rebateReport Allocation */
//            throw new \Exception('UPDATE `volumeClaims_builders` SET builder_allocation = CASE id ' . implode(' ', $rebateReportPivotsUpdateString) . ' END, total_allocation = CASE id ' . implode(' ', $rebateReportPivotsUpdateString) . ' END where id in (' . implode(',', $rebateReportPivotsUpdateIds) . ')');
//            throw new \Exception(json_encode(array_merge($rebateReportPivotsUpdateBuilderAllocations,$rebateReportPivotsUpdateTotalAllocations)));
                DB::update('UPDATE `claim_rebateReport` SET
                      builder_allocation = CASE id
                          ' . implode(' ', $rebateReportPivotsUpdateString) . '
                      END,
                      total_allocation = CASE id
                          ' . implode(' ', $rebateReportPivotsUpdateString) . '
                      END
where id in (' . implode(',', $rebateReportPivotsUpdateIds) . ')', array_merge($rebateReportPivotsUpdateBuilderAllocations,$rebateReportPivotsUpdateTotalAllocations));
            }

            if(!empty($disputesUpdateIds)){
                /*Update all Dispute with their calculated results*/
                DB::update('UPDATE `disputes` SET
                      new_builder_allocation = CASE id
                          ' . implode(' ', $disputesUpdateString) . '
                      END,
                      new_total_allocation = CASE id
                          ' . implode(' ', $disputesUpdateString) . '
                      END
where id in (' . implode(',', $disputesUpdateIds) . ')', array_merge($disputesUpdateBuilderAllocations,$disputesUpdateTotalAllocations));
            }

            /* Calculate the proper total and then set it on claim */
            $claim->report_total = round($total_allocation,2);
            $claim->save();

            DB::commit();
        } catch (\Exception $e){
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e;
        }

        return $claim;
    }
}
