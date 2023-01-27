<?php

namespace App\GraphQL\Queries;

use App\Helpers\ClaimReporting;

class SumCloseClaim
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $results = ClaimReporting::SumClaims(
            ['ready to close','close'],
            ( isset($args['year']) ? $args['year'] : null ),
            ( isset($args['quarter']) ? $args['quarter'] : null ),
            ( isset($args['builderIds']) && !empty($args['builderIds'])  ? $args['builderIds'] : null ),
            ( isset($args['programIds']) && !empty($args['programIds'])  ? $args['programIds'] : null ),
            ( isset($args['productIds']) && !empty($args['productIds'])  ? $args['productIds'] : null ),
            ( isset($args['regionIds']) && !empty($args['regionIds'])  ? $args['regionIds'] : null ),
            ( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds'])  ? $args['territoryManagerIds'] : null ) );

        return [
            'volumeTotal'=>$results['volumeTotal'],
            'factoryTotal'=>$results['factoryTotal'],
            'previousResults'=>$results['previousResults']
        ];
    }
}
