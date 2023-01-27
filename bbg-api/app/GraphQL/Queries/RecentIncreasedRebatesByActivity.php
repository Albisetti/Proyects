<?php

namespace App\GraphQL\Queries;

use App\Helpers\ConversionHelpers;
use App\Models\ConversionByActivity;

class RecentIncreasedRebatesByActivity
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        /* Retrieve all qualified by-activity conversions */
        $qualified_activity_conversions = array_filter(
            ConversionHelpers::getConversions(null, true),
            function($conversion) {
                return get_class($conversion) == "App\Models\ConversionByActivity"
                    && $conversion->qualified();
            });

        /* Sort by qualifiedAt in DESC order */
        usort($qualified_activity_conversions, function($a, $b) {
            $a_qa = $a->qualifiedAt();
            $b_qa = $b->qualifiedAt();

            return $b_qa <=> $a_qa;
        });

        /* Return at most three items */
        return array_slice($qualified_activity_conversions, 0, 3);
    }
}
