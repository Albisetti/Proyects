<?php


namespace App\Helpers;


use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthHelpers
{

    public static function whoAmI(){
        $guard = Auth::guard(config('sanctum.web'));
        $user = $guard->user();
        $impersonator = NULL;

        if(!$user) {
            throw new \Exception('Identity check from a guest or invalid user.');
        }

        $current_access_token = PersonalAccessToken::findToken(request()->bearerToken());
        if(!$current_access_token) {
            throw new \Exception('Could not retrieve authenticating token for this user, aborting.');
        }

        if(isset($current_access_token->parent_token_id)) {
            $parent_token = PersonalAccessToken::query()->where('id', $current_access_token->parent_token_id)->first();

            if($parent_token) {
                $impersonator = User::find($parent_token->tokenable_id);
            }
        }

        return [
            'user' => $user,
            'impersonator' => $impersonator
        ];
    }

    public static function extractUserFromWhoAmI($whoAmI, $getImpersonator=false){
        try {
            $whoAmI = AuthHelpers::whoAmI();

//            if( $getImpersonator && isset($whoAmI['impersonator'])){
//                $user = $whoAmI['impersonator']; //The one impersonating user
//            }else{
                $user = $whoAmI['user'];
//            }

            return $user;
        } catch (\Exception $ex){
            throw $ex;
        }
    }

    public static function seeIfUserAsAccessToOrganization($user, $orgId){
        switch ( $user->type ){
            case 'builders':
                if($user->organizations()->exists() && $user->organizations()->first()->id == $orgId) {
                    return $user->organizations()->first()->id;
                } else {
                    //Not Allow to access the requested organization
                   return false;
                }
                break;
            case 'territory_managers':
                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);

                if( $organizationIds->contains($orgId) ){
                    return $orgId;
                }else{
                    //Not Allow to access the requested organization
                    return false;
                }
                break;
            case 'admin':
                return $orgId;
            break;
            default:
                return false;
        }
    }

    /**
     * @description returns the organizations id that the passed user has access to, this should not be use for administrator
     * @param $user
     * @return \Illuminate\Support\Collection
     */
    public static function listAccessibleOrganizations($user){
        $organizationIds = collect(( $user->organizations()->exists() ? $user->organizations()->first()->id : -1));
        if($user->type === 'territory_managers')
            $organizationIds = $organizationIds->merge($user->managedOrganizations()->pluck('organizations.id')->all());
        return $organizationIds;
    }
}
