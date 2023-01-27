<?php

namespace App\GraphQL\Queries;

use App\Models\Products;

class ProductsPerProgram
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        if (isset($args['programId'])) {
            $programId = $args['programId'];
        } else {
            throw new \Exception("Must provide a bundle id");
        }

        $products = Products::whereHas('programs', function ($query) use ($programId) {
            return $query->where('program_id', '=', $programId);
        });

        return $products;
    }
}
