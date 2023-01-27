<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\SubDivision;

class ActiveSubdivisionPerBuilder
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
                if(isset($args['orgId'])){
                    if( $user->organizations()->exists() && $user->organizations()->first()->id ==$args['orgId']) {
                        $orgId = $user->organizations()->first()->id;
                    } else {
                        //Not Allow to access the requested organization
                        throw new \Exception('Not Allow to access the requested organization');
                    }
                } else {
                    $orgId = ( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                }
                break;
            case 'territory_managers':
                if(isset($args['orgId'])){
                    $organizationIds = AuthHelpers::listAccessibleOrganizations($user);

                    if( $organizationIds->contains($args['orgId']) ){
                        $orgId = $args['orgId'];
                    }else{
                        //Not Allow to access the requested organization
                        throw new \Exception('Not Allow to access the requested organization');
                    }
                } else {
                    $orgId=( $user->organizations()->exists() ? $user->organizations()->first()->id : -1);
                }
                break;
            default:
                return SubDivision::where('id',-1);
        }

        $subdivisions = SubDivision::has('houses')->whereHas('organization',function ($query)use($orgId){
            $query->where('id',$orgId);
        });
        return $subdivisions;
    }
}
