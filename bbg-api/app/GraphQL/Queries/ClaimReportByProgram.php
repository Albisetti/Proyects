<?php

namespace App\GraphQL\Queries;

class ClaimReportByProgram
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {

        $programs = \App\Models\Programs::has('claims');

        if( isset($args['programIds']) && !empty($args['programIds']) ) $programs->where('id',$args['programIds']);

        //Filter out programs not associated to pass product id
        if( isset($args['productIds'])  && !empty($args['productIds']) ) $programs->where(function ($query)use($args){
            $query
                ->whereHas('products',function ($query)use($args){
                    $query->whereIn('products.id',$args['productIds']);
                })
                ->orWhereHas('organizationCustomProducts',function ($query)use($args){
                    $query->whereIn('products.id',$args['productIds']);
                });
        });

        //Filter out programs not associated to pass state id
        if( isset($args['regionIds'])  && !empty($args['regionIds']) ) $programs->whereHas('regions',function ($query)use($args){
            $query->whereIn('states.id',$args['regionIds']);
        });

        //Filter out programs not associated to pass builder (Org) id
        if( isset($args['builderIds']) && !empty($args['builderIds'])) $programs->where(function ($query)use($args){
            $query
                ->whereHas('participants',function ($query)use($args){
                    $query->whereIn('organizations.id',$args['builderIds']);
                })
                ->orWhere(function ($query)use($args){
                    //Find the rebates that are using this program's products and then see if their organization matches id provided
                    $query
                        ->whereHas('products',function ($query)use($args){
                            $query->whereHas('rebateReports',function ($query)use($args){
                                $query->whereHas('organization',function ($query)use($args){
                                    $query->whereIn('organizations.id',$args['builderIds']);
                                });
                            });
                        })
                        ->orWhereHas('organizationCustomProducts',function ($query)use($args){
                            $query->whereHas('rebateReports',function ($query)use($args){
                                $query->whereHas('organization',function ($query)use($args){
                                    $query->whereIn('organizations.id',$args['builderIds']);
                                });
                            });
                        })
                    ;
                })
            ;
        });

        //Filter out programs not associated to pass TM (User) id
        if( isset($args['territoryManagerIds']) && !empty($args['territoryManagerIds'])) $programs->where(function ($query)use($args){
            $query
                ->whereHas('participants',function ($query)use($args){
                    $query->whereHas('territoryManagers',function($query)use($args){
                        $query->whereIn('users.id',$args['territoryManagerIds']);
                    });
                })
                ->orWhere(function ($query)use($args){
                    //Find the rebates that are using this program's products and then see if their organization TM contains the id provided
                    $query
                        ->whereHas('products',function ($query)use($args){
                            $query->whereHas('rebateReports',function ($query)use($args){
                                $query->whereHas('organization',function ($query)use($args){
                                    $query->whereHas('territoryManagers',function($query)use($args){
                                        $query->whereIn('users.id',$args['territoryManagerIds']);
                                    });
                                });
                            });
                        })
                        ->orWhereHas('organizationCustomProducts',function ($query)use($args){
                            $query->whereHas('rebateReports',function ($query)use($args){
                                $query->whereHas('organization',function ($query)use($args){
                                    $query->whereHas('territoryManagers',function($query)use($args){
                                        $query->whereIn('users.id',$args['territoryManagerIds']);
                                    });
                                });
                            });
                        })
                    ;
                })
            ;
        });

        $programs = $programs->get();

        return $programs;
    }
}
