<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class SearchSubdivisionsPerBuilder
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

        if( isset($args['orgId']) ) {
            $orgId = AuthHelpers::seeIfUserAsAccessToOrganization($user, $args['orgId']);
            if($orgId===false) throw new \Exception("Not Allow to access the requested organization");
        } else {
            $orgId = ( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
        }

        $subdivisions = \App\Models\SubDivision::search(
            $args['search']
        )
            ->where('organization_id',$orgId)
        ;

        return $subdivisions;
    }
}
