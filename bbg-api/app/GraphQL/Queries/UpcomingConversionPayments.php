<?php

namespace App\GraphQL\Queries;

use App\Helpers\ConversionHelpers;
use Carbon\Carbon;

class UpcomingConversionPayments
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $unqualified_conversions = array_filter(
            ConversionHelpers::getConversions(null, false),

            function($conversion) {
                $td = Carbon::parse($conversion->anticipated_payment_date)->diffInWeeks(Carbon::now());

                return get_class($conversion) != "App\Models\ConversionByActivity"
                    && $conversion->anticipated_payment_date > Carbon::now()
                    && $td < 3;
            });

        return $unqualified_conversions;
    }
}
