<?php

namespace App\GraphQL\Queries;

class ClaimReportByTM
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $territoryManagers = \App\Models\User::
        where('type', 'territory_managers')
            ->whereHas('managedOrganizations', function ($query) {
                $query->where(function ($query) {
                    $query
                        ->has('volumeClaims')
                        ->orWhereHas('rebateReports', function ($query) {
                            $query->whereHas('rebates', function ($query) {
                                $query->has('claims');
                            });
                        });
                });
            });

        if( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds']) )$territoryManagers->where('id',$args['territoryManagerIds']);

        //Filter out TMs not managing the pass builder Ids
        if( isset($args['builderIds']) && !empty($args['builderIds']) ) $territoryManagers->whereHas('managedOrganizations',function($query)use($args){
            $query->whereIn('organizations.id',$args['builderIds']);
        });

        //Filter out TMs not managing the pass state id
        if( isset($args['regionIds']) && !empty($args['regionIds']) )
            $territoryManagers->whereHas('managedStates',function ($query)use($args){
                $query->whereIn('states.id',$args['regionIds']);
            });

        //Filter out Builders who aren't connected or using the provided product Ids
        if( isset($args['productIds']) && !empty($args['productIds']) ) $territoryManagers->whereHas('managedOrganizations',function($query)use($args){
            $query->where(function ($query)use($args){
                $query
                    ->whereHas('customProducts',function ($query)use($args){
                        $query->whereIn('products.id',$args['productIds']);
                    })
                    ->orWhereHas('rebateReports',function($query)use($args){
                        $query->whereHas('rebates',function ($query)use($args){
                            $query->whereIn('product_id',$args['productIds']);
                        });
                    })
                ;
            });
        });

        //Filter out Builders that are not connected or using specified program ID, TODO: change to availablePrograms?
        if( isset($args['programIds']) && !empty($args['programIds']) )  $territoryManagers->whereHas('managedOrganizations',function($query)use($args){
            $query->where(function ($query)use($args){
                $query
                    ->whereHas('programs',function ($query)use($args){
                        $query->whereIn('programs.id',$args['programIds']);
                    })
                    ->orWhereHas('rebateReports',function($query)use($args){
                        $query->whereHas('rebates',function ($query)use($args){
                            $query->whereHas('claims',function ($query)use($args){
                                $query->whereIn('program_id',$args['programIds']);
                            });
                        });
                    })
                ;
            });
        });

        $territoryManagers = $territoryManagers->get();

        return $territoryManagers;
    }
}
