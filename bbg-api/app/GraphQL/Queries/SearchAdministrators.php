<?php

namespace App\GraphQL\Queries;

use MeiliSearch\Endpoints\Indexes;

class SearchAdministrators
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $users = \App\Models\User::search(
	    $args['search'],
	    function (Indexes $meilisearch, $query, $options) {
                $options['filter'] = 'type=admin';

            	return $meilisearch->search($query, $options);
	    }
	);

        return $users;
    }
}
