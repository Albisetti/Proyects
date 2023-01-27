<?php

namespace App\GraphQL\Queries;

class ProjectedRevenue
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        //TODO: is this used in FE, if not delete, or at least make it do something
        return 0;
    }
}
