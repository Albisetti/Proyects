<?php

namespace App\Listeners;

use App\Helpers\RebateReporting;
use App\Models\OrganizationCustomProduct;
use App\Models\ProductsPrograms;
use App\Models\ProgramParticipants;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

class VolumeClaimsBuildersSaved
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
        $volumeClaimBuilder = $event->volumeClaimBuilder;

        /* Objects and relationships required */
        $claim = $volumeClaimBuilder->claim()->first();
        if(!$claim) {
            throw new \Exception('Failed to find associated claim during claim-builder report save event.');
        }

        $program = $claim->program()->first();
        if(!$program) {
            throw new \Exception('Failed to find associated program during claim-builder report save event.');
        }

        $builderOrg = $volumeClaimBuilder->builder()->first();
        if(!$builderOrg) {
            throw new \Exception('Failed to find associated builder during claim-builder save event.');
        }

        //TODO: check if $builderOrg can participate in $claim->program
//        throw new \Exception(json_encode($builderOrg->availablePrograms($builderOrg)));
//        $builderAvailablePrograms = $builderOrg->availablePrograms($builderOrg)->where('id',$program->id)->exists();
//        if( !$builderAvailablePrograms ) throw new \Exception('Builder is not a valid participant');

        $rebateAmount = (
            (isset($volumeClaimBuilder->rebate_adjusted) && !empty($volumeClaimBuilder->rebate_adjusted)) || ((int)$volumeClaimBuilder->rebate_adjusted==0 && $volumeClaimBuilder->rebate_adjusted!==null)
                ? $volumeClaimBuilder->rebate_adjusted
                : $volumeClaimBuilder->rebate_earned
        );

        if ( isset($claim->claim_template_product_id) && !empty($claim->claim_template_product_id) ) {
            $claimTemplateProductionOverwrite = ProductsPrograms::
            where('program_id',$program->id)
                ->where('product_id',$claim->claim_template_product_id)
                ->first()
            ;

            $claimTemplateOrgOverwrite = OrganizationCustomProduct::
            where('organization_id',$builderOrg->id)
                ->where('program_id',$program->id)
                ->where('product_id',$claim->claim_template_product_id)
                ->first()
            ;

            if ($claimTemplateOrgOverwrite && isset($claimTemplateOrgOverwrite->volume_bbg_rebate) && !empty($claimTemplateOrgOverwrite->volume_bbg_rebate)) {
                $tierAmount = $claimTemplateOrgOverwrite->volume_bbg_rebate;
            } else {
                if ($claimTemplateProductionOverwrite && isset($claimTemplateProductionOverwrite->volume_bbg_rebate) && !empty($claimTemplateProductionOverwrite->volume_bbg_rebate)) {
                    $tierAmount = $claimTemplateProductionOverwrite->volume_bbg_rebate;
                } else {
                    $tierAmount = RebateReporting::$MOCK_TIERS[$builderOrg->member_tier];
                }
            }
        } else {
            $programOrganizationOverwrite = ProgramParticipants::
            where('program_id',$program->id)
                ->where('organization_id',$builderOrg->id)
                ->first()
            ;

            if ($programOrganizationOverwrite && isset($programOrganizationOverwrite->volume_bbg_rebate) && !empty($programOrganizationOverwrite->volume_bbg_rebate)) {
                $tierAmount = $programOrganizationOverwrite->volume_bbg_rebate;
            } else {
                $tierAmount = RebateReporting::$MOCK_TIERS[$builderOrg->member_tier];
            }
        }

        $builderAllocation = $rebateAmount * ($tierAmount / 100);

        if( $program->is_flat_rebate ){
            $builderAllocation = $program->flat_builder_rebate;
            $bbg_keeps = $program->flat_bbg_rebate;
            $rebateAmount = $bbg_keeps + $builderAllocation;
        }

        DB::beginTransaction();
        try {
            $volumeClaimBuilder->total_allocation = $rebateAmount;
            $volumeClaimBuilder->builder_allocation = $builderAllocation;
            $volumeClaimBuilder->save(['skipAllocation'=>true]);

            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }
    }
}
