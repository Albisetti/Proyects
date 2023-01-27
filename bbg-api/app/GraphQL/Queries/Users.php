<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\User;

class Users
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

        $users = (new User)->newQuery();
        if( isset($args['user_type']) ){
            $users->where(function ($query)use($args){
                foreach ( $args['user_type'] as $user_type ){
                    $query->orWhere('type', $user_type);
                }
            });
        }

        switch ($user->type){
            case 'builders':
                // Uncomment/comment the following if builder should only see themselves or not
//                $users->where('id',$user->id);
//                break;
            case 'territory_managers':
                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);

                //Uncomment the following if TM/BUILDERS shouldn't see admin
//                $users->where('type','!=','admin');

                $users->where(function ($query)use($organizationIds,$user){
                    $query
                        ->whereHas('organizations',function ($query)use($organizationIds,$user){
                            $query->whereIn('organizations.id',$organizationIds);
                        })
                        ->orWhereHas('managedOrganizations',function ($query)use($organizationIds,$user){
                            $query->whereIn('organizations.id',$organizationIds);
                        })
                        ->orWhere('id',$user->id);
                    ;
                });
                break;
            case 'admin':
            case 'executive':
            default:
                break;
        }

        return $users;
    }
}
