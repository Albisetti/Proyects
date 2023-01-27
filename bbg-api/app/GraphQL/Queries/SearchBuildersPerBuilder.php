<?php

namespace App\GraphQL\Queries;

use App\Models\Bundles;
use MeiliSearch\Endpoints\Indexes;

class SearchBuildersPerBuilder
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver
        $bundles = Bundles::search(
            $args['search']
        )
        ->where('organization_id',$args['orgId'])
        ;
        return $bundles;
    }
}
