<?php

namespace App\GraphQL\Queries;

use App\Models\Bundles;

class BuildersPerBuilder
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $bundles = Bundles::where('organization_id',$args['orgId']);
        return $bundles;
    }
}
