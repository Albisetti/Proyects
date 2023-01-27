<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\SubDivision;
use MeiliSearch\Endpoints\Indexes;

class SubdivisionsPerBuilder
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

        switch ( $user->type ){
            case 'builders':
                $orgId = ( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                break;
            case 'territory_managers':
                if(isset($args['orgId'])){
                    if( $user->id == $args['orgId'] ){
                        $orgId=$user->organizations()->first()->id;
                    } else if( $user->managedOrganizations->contains($args['orgId']) ){
                        $orgId=$args['orgId'];
                    } else {
                        //Trying to access un-manage org
                        return SubDivision::where('id',-1);
                    }
                } else {
                    $orgId=( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                }
                break;
            default:
                $orgId=( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
        }

        $subdivisions = SubDivision::where('organization_id',$orgId);
        return $subdivisions;
    }
}
