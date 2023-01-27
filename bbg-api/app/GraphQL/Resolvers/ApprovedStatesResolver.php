<?php

namespace App\GraphQL\Resolvers;

use App\Models\State;

class ApprovedStatesResolver
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $approvedStates = explode(",",$_->approved_states);
        //dd($approvedStates, str_replace(["[","]"],"",json_encode($approvedStates)), $_, $args);
        return State::query()->whereIn('name',[str_replace(["[","]"],"",json_encode($approvedStates))])->get();
    }
}
