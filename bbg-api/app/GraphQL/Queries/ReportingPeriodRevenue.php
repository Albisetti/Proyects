<?php

namespace App\GraphQL\Queries;

class ReportingPeriodRevenue
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
		if(isset($args['current']) && $args['current'] == true) {
			return 0;
		}

        return 0;
    }
}
