<?php

namespace App\GraphQL\Mutations;

use App\Models\ClaimPeriods;
use Carbon\Carbon;

class ArchiveClaimPeriod
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $claimPeriod = ClaimPeriods::find($args['id']);
        //TODO:archived_by
        $claimPeriod->archived_at = Carbon::now();
        $claimPeriod->save();
        return $claimPeriod;
    }
}
