<?php

namespace App\GraphQL\Mutations;

use App\Events\ClaimUpdate;
use App\Models\Claims;

class CalculateIndividualBuilderClaimAllocation
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $claim = Claims::where('id',$args['id'])
            ->with(
                [
                    'rebateReports',
                    'rebateReports.rebateReports',
                    'rebateReports.rebateReports.organization',
                    'rebateReports.rebateReports.organization.programs',
                    'rebateReports.rebateReports',
                    'rebateReports.houses',
                    'rebateReports.products',
                    'rebateReports.products.programs',
                    'rebateReports.products.customization',
                    'rebateReports.products.organizationOverwrites',
                    'rebateReports.products.organizationOverwritesProgram',
                    'rebateReports.dispute'
                ]
            )
            ->first(); //TODO: with are individual gets

        if($claim && $claim->claim_type == 'factory'){
            //For Volume, see VolumeClaimsBuilders->save()
            $results = event(new ClaimUpdate($claim, (isset($args['closing'])?$args['closing']:false), (isset($args['builderId'])?$args['builderId']:null)));

            if(!empty($results) && !empty($results[0])){
                return $results[0]->refresh();
            } else {
                return $claim;
            }
        }

        return $claim;
    }
}
