<?php

namespace App\GraphQL\Queries;

use App\Models\Products;

class ProductsPerBundle
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // TODO implement the resolver

        if ( isset( $args['bundleId'] ) ) {
            $bundleId = $args['bundleId'];
        } else {
            throw new \Exception("Must provide a bundle id");
        }

        $products = Products::whereHas('bundles', function ($query) use ($bundleId) {
            return $query->where('bundle_id', '=', $bundleId);
        });

        return $products;
    }
}
