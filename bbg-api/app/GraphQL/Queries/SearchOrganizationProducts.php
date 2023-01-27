<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;

class SearchOrganizationProducts
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

        $orgId = AuthHelpers::seeIfUserAsAccessToOrganization($user, $args['id']);
        if($orgId===false) throw new \Exception("Not Allow to access the requested organization");

        return \App\Models\Organizations::searchAvailableProducts($orgId, (isset($args['trashedProducts'])?$args['trashedProducts']:false),(isset($args['search']) ? $args['search'] : null));
    }
}
