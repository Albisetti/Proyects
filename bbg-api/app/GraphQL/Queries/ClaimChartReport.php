<?php

namespace App\GraphQL\Queries;

use App\Helpers\ClaimReporting;

class ClaimChartReport
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $openClaimQuery = ClaimReporting::SumClaims(
            ['open','ready','submitted','disputed'],
            null,
            null,
            ( isset($args['builderIds']) && !empty($args['builderIds']) ? $args['builderIds'] : null ),
            ( isset($args['programIds'])  && !empty($args['programIds'])  ? $args['programIds'] : null ),
            ( isset($args['productIds'])  && !empty($args['productIds'])  ? $args['productIds'] : null ),
            ( isset($args['regionIds'])  && !empty($args['regionIds'])  ? $args['regionIds'] : null ),
            ( isset($args['territoryManagerIds'])  && !empty($args['territoryManagerIds'])  ? $args['territoryManagerIds'] : null ) );

        $openClaimResults = [
            'volumeTotal'=>$openClaimQuery['volumeTotal'],
            'factoryTotal'=>$openClaimQuery['factoryTotal'],
            'contributingPrograms'=>$openClaimQuery['contributingPrograms'],
        ];

        $openClaimResults = [
            'volumeTotal'=>0,
            'factoryTotal'=>0,
            'contributingPrograms'=>null,
        ];

        $closeYearClaimQuery = ClaimReporting::SumClaims(
            ['ready to close','close'],
            ( isset($args['year']) ? $args['year'] : null ),
            null,
            ( isset($args['builderIds'])  && !empty($args['builderIds'])  ? $args['builderIds'] : null ),
            ( isset($args['programIds'])  && !empty($args['programIds'])  ? $args['programIds'] : null ),
            ( isset($args['productIds'])  && !empty($args['productIds'])  ? $args['productIds'] : null ),
            ( isset($args['regionIds'])  && !empty($args['regionIds'])  ? $args['regionIds'] : null ),
            ( isset($args['territoryManagerIds'])  && !empty($args['territoryManagerIds'])  ? $args['territoryManagerIds'] : null ) );

        $closeYearClaimResults = [
            'volumeTotal'=>$closeYearClaimQuery['volumeTotal'],
            'factoryTotal'=>$closeYearClaimQuery['factoryTotal'],
            'contributingPrograms'=>$closeYearClaimQuery['contributingPrograms'],
            'previousResults'=>$closeYearClaimQuery['previousResults']
        ];

        $closeYearClaimResults = [
            'volumeTotal'=>0,
            'factoryTotal'=>0,
            'contributingPrograms'=>null,
            'previousResults'=>null
        ];

        $closePeriodClaimQuery = ClaimReporting::SumClaims(
            ['ready to close','close'],
            ( isset($args['year']) ? $args['year'] : null ),
            ( isset($args['quarter']) ? $args['quarter'] : null ),
            ( isset($args['builderIds']) && !empty($args['builderIds'])  ? $args['builderIds'] : null ),
            ( isset($args['programIds']) && !empty($args['programIds'])  ? $args['programIds'] : null ),
            ( isset($args['productIds']) && !empty($args['productIds'])  ? $args['productIds'] : null ),
            ( isset($args['regionIds']) && !empty($args['regionIds'])  ? $args['regionIds'] : null ),
            ( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds'])  ? $args['territoryManagerIds'] : null ) );

        $closePeriodClaimResults = [
            'volumeTotal'=>$closePeriodClaimQuery['volumeTotal'],
            'factoryTotal'=>$closePeriodClaimQuery['factoryTotal'],
            'contributingPrograms'=>$closePeriodClaimQuery['contributingPrograms'],
            'previousResults'=>$closePeriodClaimQuery['previousResults']
        ];

        $closePeriodClaimResults = [
            'volumeTotal'=>0,
            'factoryTotal'=>0,
            'contributingPrograms'=>null,
            'previousResults'=>null
        ];

        $allCloseClaimTotalQuery = ClaimReporting::calculateAllClaimTotal(
            ( isset($args['builderIds']) && !empty($args['builderIds'])  ? $args['builderIds'] : null ),
            ( isset($args['programIds']) && !empty($args['programIds'])  ? $args['programIds'] : null ),
            ( isset($args['productIds']) && !empty($args['productIds'])  ? $args['productIds'] : null ),
            ( isset($args['regionIds']) && !empty($args['regionIds'])  ? $args['regionIds'] : null ),
            ( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds'])  ? $args['territoryManagerIds'] : null )
        );

        $allCloseClaimTotalResults = [
            'total'=>$allCloseClaimTotalQuery['total'],
            'programsAllocation'=>$allCloseClaimTotalQuery['programsAllocation']
        ];

        $allCloseClaimTotalResults = [
            'total'=>0,
            'programsAllocation'=>null
        ];

        return [
            'currentOpenClaims'=>$openClaimResults,
            'yearCloseClaims'=>$closeYearClaimResults,
            'periodCloseClaims'=>$closePeriodClaimResults,
            'allCloseClaimsTotal'=>$allCloseClaimTotalResults
        ];
    }
}
