<?php

namespace App\GraphQL\Queries;

class ClaimReportByProduct
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        $products = \App\Models\Products::whereHas('rebateHouseProduct',function($query){
            $query->has('claims');
        });

        if( isset($args['productIds']) && !empty($args['productIds']) ) $products->whereIn('id',$args['productIds']);

        //Filter out products not associated to pass program id
        if( isset($args['programIds']) && !empty($args['programIds']) ) $products->where(function ($query)use($args){
            $query
                ->whereHas('programs',function ($query)use($args){
                    $query->whereIn('programs.id',$args['programIds']);
                })
                ->orWhereHas('organizationOverwrites', function ($query) use ($args){
                    $query->whereIn('organization_customProducts.program_id',$args['programIds']);
                });
        });

        //Filter out products not associated to a program who is connected to the pass state id
        if( isset($args['regionIds']) && !empty($args['regionIds']) ) $products->where(function ($query)use($args){
            $query
                ->whereHas('programs',function ($query)use($args){
                    $query->whereHas('regions',function ($query)use($args){
                        $query->whereIn('states.id',$args['regionIds']);
                    });
                })
                ->orWhereHas('organizationOverwritesProgram',function ($query)use($args){
                    $query->whereHas('regions',function ($query)use($args){
                        $query->whereIn('states.id',$args['regionIds']);
                    });
                });
        });

        //Filter out products not associated to a rebate under the passed builder (Org) id
        if( isset($args['builderIds']) && !empty($args['builderIds']) ) $products->where(function ($query)use($args){
            $query
                ->whereHas('rebateReports',function ($query)use($args){
                    $query->whereHas('organization',function ($query)use($args){
                        $query->whereIn('organizations.id',$args['builderIds']);
                    });
                })
            ;
        });

        //Filter out products not associated to a rebate who's builder (Org) is not managed by the pass TM (User) Ids
        if( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds']) ) $products->where(function ($query)use($args){
            $query
                ->whereHas('rebateReports',function ($query)use($args){
                    $query->whereHas('organization',function ($query)use($args){
                        $query->whereHas('territoryManagers',function($query)use($args){
                            $query->whereIn('users.id',$args['territoryManagerIds']);
                        });
                    });
                })
            ;
        });

        $products = $products->get();

        return $products;
    }
}
