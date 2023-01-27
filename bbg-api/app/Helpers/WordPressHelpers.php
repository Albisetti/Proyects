<?php
/*
 * Static methods providing some external WordPress functionality.
 */
namespace App\Helpers;

use Illuminate\Support\Facades\Http;

use App\Models\User;

class WordPressHelpers {
    public static function login() {
        /* Authenticate directly against WordPress */

        if( empty(config('bbg.wordpress.graphql_endpoint')) ) return false;

        $resp = Http::Post(config('bbg.wordpress.graphql_endpoint'), [
            'query' => <<<EOF
mutation Login(\$username: String!, \$password: String!) {
    login(input: { username: \$username, password: \$password }) {
        authToken
        refreshToken
    }
}
EOF,
            'variables' => [
                'username' => config('bbg.wordpress.username'),
                'password' => config('bbg.wordpress.password')
            ]
        ]);

        /*
         * If this fails for any reason, an exception is thrown that will bubble up to the
         * user attempting login.
         */
        $result = $resp->throw()->json();

        /* If either there is no user or the login failed, then opaquely return failure. */
        if(!$result
        || !isset($result['data'])
        || !isset($result['data']['login'])
        || !isset($result['data']['login']['authToken'])
        ) {
            return false;
        }



        /* Try to retrieve and update, or else create the user and their primary role. */
        $wordpress_token = $result['data']['login']['authToken'];

        return $wordpress_token;
    }


    public static function createProgram($program,$auth) {

        /* Authenticate directly against WordPress */
        $resp = Http::withToken($auth)->post(config('bbg.wordpress.graphql_endpoint'), [
            'query' => <<<EOF
            mutation createProgram(\$name: String, \$slug: String) {
                createProgram(input: { slug: \$slug, title: \$name }) {
                    program {
                        id
                        title
                    }
                }
            }
EOF,
            'variables' => [
                'name' => $program->name,
                'slug' => strval($program->id),
            ]
        ]);

        /*
         * If this fails for any reason, an exception is thrown that will bubble up to the
         * user attempting login.
         */
        $result = $resp->throw()->json();

        /* If either there is no user or the login failed, then opaquely return failure. */
        if(!$result
        || !isset($result['data'])
        || !isset($result['data']['createProgram'])
        || !isset($result['data']['createProgram']['program'])
        || !isset($result['data']['createProgram']['program']['title'])
        ) {
            throw new \Exception('Can not create a program in wordpress');
        }


        /* Try to retrieve and update, or else create the user and their primary role. */
        $wordPressProgram = $result['data']['createProgram']['program']['title'];

        return $wordPressProgram;
    }
}
