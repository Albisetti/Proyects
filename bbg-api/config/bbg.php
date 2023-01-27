<?php

/* 
 * Project-specific configuration.
 */
return [
    'wordpress' => [
        'graphql_endpoint' => env('WORDPRESS_GRAPHQL_ENDPOINT', ''),
        'username' => env('WORDPRESS_USERNAME', ''),
        'password' => env('WORDPRESS_PASSWORD', ''),
    ]
];