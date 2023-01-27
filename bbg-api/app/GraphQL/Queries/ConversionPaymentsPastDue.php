<?php

namespace App\GraphQL\Queries;

use App\Helpers\ConversionHelpers;
use Carbon\Carbon;

class ConversionPaymentsPastDue
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        /* Retrieve all qualified by-activity conversions */
        $qualified_activity_conversions = array_filter(
            ConversionHelpers::getConversions(null, false),
            function($conversion) {
                return get_class($conversion) != "App\Models\ConversionByActivity"
                    && $conversion->anticipated_payment_date < Carbon::now();
            });

        return $qualified_activity_conversions;
    }
}
