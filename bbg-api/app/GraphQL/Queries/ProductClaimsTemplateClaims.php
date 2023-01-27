<?php

namespace App\GraphQL\Queries;

use App\Models\Programs;

class ProductClaimsTemplateClaims
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        if ( isset( $args['programId'] ) ) {
            $programId = $args['programId'];
        } else {
            throw new \Exception('Must provide a program id');
        }

        $returnData = [];

//        $returnData = [
//            'product' => Product
//            'organizationOverwrites'
//            'programs'
//        ]

        $program = Programs::findOrFail($programId);
        $products = $program->allClaimTemplateProducts()->get();

        foreach ( $products as $product ){
            if (!isset($returnData[$product->id])){
                $returnData[$product->id] = [
                    'model'=>$product,
                    'claim_template'=>[],
                    'customProduct_claim_template'=>[],
                ];

                $returnData[$product->id]['claim_template'][] = $products->programs()->wherePivotNotNull('volume_bbg_rebate')->orderBy('updated_at','desc')->get();
                $returnData[$product->id]['customProduct_claim_template'][] = $products->organizationOverwrites()->wherePivotNotNull('volume_bbg_rebate')->orderBy('updated_at','desc')->get();
                unset($returnData[$product->id]['model']['pivot']);
            } else {
                $returnData[$product->id]['claim_template'][] = $products->programs()->wherePivotNotNull('volume_bbg_rebate')->orderBy('updated_at','desc')->get();
                $returnData[$product->id]['customProduct_claim_template'][] = $products->organizationOverwrites()->where('program_id',$programId)->wherePivotNotNull('volume_bbg_rebate')->orderBy('updated_at','desc')->get();
            }
        }

        return $returnData;
    }
}
