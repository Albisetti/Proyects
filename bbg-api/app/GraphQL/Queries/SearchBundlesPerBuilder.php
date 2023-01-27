<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use MeiliSearch\Endpoints\Indexes;

class SearchBundlesPerBuilder
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        try {
            $whoAmI = AuthHelpers::whoAmI();
            $user = AuthHelpers::extractUserFromWhoAmI($whoAmI);
        } catch (\Exception $ex){
            throw $ex;
        }

        switch ($user->type){
            case 'builders':
                $org_id = ( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                break;
            default:
                $org_id = ( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                if(isset($args['orgId']))$org_id= $args['orgId'];
                break;
        }

        if(!isset($org_id)) return \App\Models\Bundles::where('id',-1); //No Organization provided

        $bundles = \App\Models\Bundles::search($args['search'])
            ->where('organization_id',$org_id)
        ;
        return $bundles;
    }
}
