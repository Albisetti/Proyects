<?php

namespace App\GraphQL\Queries;

use App\Helpers\AuthHelpers;
use App\Models\SystemMessage;
use function Clue\StreamFilter\fun;

class Organizations
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

        $organizations = (new \App\Models\Organizations)->newQuery();
        if( isset($args['organization_type']) ){
            $organizations->whereIn('organization_type', $args['organization_type']);
        }

        switch ($user->type){
            case 'builders':
                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
                $organizations->whereIn('id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
                break;
            case 'territory_managers':
                $organizationIds = AuthHelpers::listAccessibleOrganizations($user);
                $supplierCheck = collect($args['organization_type'])->contains('suppliers');
                $manufacturersCheck = collect($args['organization_type'])->contains('manufacturers');
                if($supplierCheck ||$manufacturersCheck) {
                    $organizations->where(function ($query)use($supplierCheck,$manufacturersCheck,$organizationIds){
                        $orgType = collect([]);
                        if( isset($supplierCheck) && $supplierCheck ) $orgType->push('suppliers');
                        if( isset($manufacturersCheck) && $manufacturersCheck ) $orgType->push('suppliers');
                        $query->whereIn('organization_type', $orgType)->orWhereIn('id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
                    });
                } else {
                    $organizations->whereIn('id',(!$organizationIds->isEmpty() ? $organizationIds->toArray() : [-1]));
                }
                break;
            case 'admin':
            case 'executive':
            default:
                break;
        }

        return $organizations;
    }
}
