<?php

namespace App\GraphQL\Queries;

use App\Helpers\ClaimReporting;
use \App\Models\Organizations;

class ClaimReportByBuilder
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        $builder = \App\Models\Organizations::
            where('organization_type','builders')
            ->where(function ($query){
                $query
                    ->has('volumeClaims')
                    ->orWhereHas('rebateReports',function($query){
                        $query->whereHas('rebates',function ($query){
                            $query->has('claims');
                        });
                    })
                ;
            })
        ;

        if( isset($args['builderIds']) && !empty($args['builderIds']) ) $builder->where('id',$args['builderIds']);

        //Filter out Builders not associated to the pass state id
        if( isset($args['regionIds']) && !empty($args['regionIds']) )
            $builder->whereHas('approved_states',function ($query)use($args){
                    $query->whereIn('states.id',$args['regionIds']);
            });

        //Filter out Builders not managed by the pass TM (User) Ids
        if( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds']) )
            $builder->whereHas('territoryManagers',function($query)use($args){
                $query->whereIn('users.id',$args['territoryManagerIds']);
            });

        //Filter out Builders who aren't connected or using the provided product Ids
        if( isset($args['productIds']) && !empty($args['productIds']) ) $builder->where(function ($query)use($args){
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

        //Filter out Builders that are not connected or using specified program ID, TODO: change to availablePrograms?
        if( isset($args['programIds']) && !empty($args['programIds']) ) $builder->where(function ($query)use($args){
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

        $builder = $builder->get();

        return $builder;
    }
}
