<?php

namespace App\GraphQL\Queries;

use App\Helpers\ConversionHelpers;
use App\Models\Programs;

class ConversionRevenue
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $program = NULL;

        if(isset($args['program_id'])) {
            $program_id = $args['program_id'];

            $program = Programs::find($program_id);
            if(!$program) {
                throw new \Exception('Tried to retrieve conversion revenue for a bad program ID.');
            }
        }

        $report = ConversionHelpers::conversionRevenue($program, isset($args['year']) ? $args['year'] : null);
        return $report;
    }
}
