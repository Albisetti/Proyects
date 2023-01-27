<?php

namespace App\GraphQL\Queries;

use App\Models\Claims;
use App\Models\OrganizationCustomProduct;
use App\Models\Products;

class VolumeClaims
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        if( !isset($args['product_id']) || !isset($args['program_id']) ) throw new \Exception('Missing Id');

        if ( strtolower($args['product_id']) !== 'all' ){
            $product = Products::find($args['product_id']);
            if( !$product ) throw new \Exception('Unable to find Product');
        }
        $claims = Claims::where('program_id',$args['program_id']);

        if ( strtolower($args['product_id']) !== 'all' ){
            $claims = $claims
                ->where('claim_template_product_type',
                    ( $product->customization()->exists() ? 'App\\Models\\OrganizationCustomProduct' : 'App\\Models\\ProductsPrograms')
                )->where('claim_template_product_id',$args['product_id']);
        } else {
            $claims = $claims->where('claim_template_product_id',null);
        }

        $claims = $claims->orderBy('id','desc')->take(2)->get();

        $currentClaim = (
            isset($claims[0])
            && ($claims[0]->status !== 'close' || $claims[0]->status !== 'ready to close')
                ? $claims[0] : null );

        if ( isset($claims[0]) && ($claims[0]->status === 'close' || $claims[0]->status === 'ready to close') ) {
            $previousClaim = $claims[0];
        } elseif ( isset($claims[1]) ) {
            $previousClaim = $claims[1];
        } else {
            $previousClaim = null;
        }

        return [
            'currentClaim' => $currentClaim,
            'lastClosedClaim' => $previousClaim
        ];

        return null;
    }
}
