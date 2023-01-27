<?php

namespace App\GraphQL\Mutations;

class DeleteProductImages
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        dd($_,$args);
    }
}
