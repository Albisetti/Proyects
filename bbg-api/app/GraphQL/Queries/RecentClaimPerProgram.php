<?php

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\Auth;

use App\Models\Claims;
use App\Models\Programs;

class RecentClaimPerProgram
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
//        $guard = Auth::guard(config('sanctum.guard'));
//        $user = $guard->user();
//
//        /* If there is no user, we cannot proceed. */
//        if (!$user) {
//            throw new \Exception('Unauthenticated user attempting request on resolver requiring authorization.');
//        }

        $programs = Programs::all()->toArray();

        /* If there are no results, we cannot proceed. */
        if (!count($programs)) {
            /* Short circuit: return a claim which can never have results. */
            return Claims::whereNull('id');
        }

        /*
         * There is at least one program, so shift it out and use it for the
         * base query against which we will union all others.
         */
        $first_program = array_shift($programs);

        /*
         * Each query is of this form:
         *
         * For each program, retrieve the 2 recentmost claims in descending order.
         */
        $query = Claims::join('programs', 'claims.program_id', 'programs.id')
            ->select([
                'claims.id',
                'claims.name',
                'claims.claim_type',
                'claims.report_quarter',
                'claims.report_year',
                'claims.claim_start_date',
                'claims.claim_end_date',
                'claims.total_payment_rebate',
                'claims.report_total',
                'claims.claimPeriod_id',
                'claims.status',
                'claims.claim_template_product_id',
                'claims.claim_template_product_type',

                'claims.created_by',
                'claims.created_at',
                'claims.updated_by',
                'claims.updated_at',
                'claims.delete_by', /* delete_at? schema typo? */
                'claims.deleted_at',

                'programs.id AS program_id',
                'programs.name AS program_name'
            ])
            ->where('claims.program_id', $first_program['id'])
            ->whereNotIn('claims.status', ['close','ready to close'])
            ->where(function ($query){
                $query->where('programs.type','factory')->orWhere(function ($query){
                   $query->where('programs.type','volume')->whereNotNull('programs.volume_bbg_rebate');
                });
            })
            ->limit(1)
            ->orderBy('id', 'desc');

        /* UNION in each remaining program query */
        foreach ($programs as $program) {
            $additional_claim_query = Claims::join('programs', 'claims.program_id', 'programs.id')
                ->select([
                    'claims.id',
                    'claims.name',
                    'claims.claim_type',
                    'claims.report_quarter',
                    'claims.report_year',
                    'claims.claim_start_date',
                    'claims.claim_end_date',
                    'claims.total_payment_rebate',
                    'claims.report_total',
                    'claims.claimPeriod_id',
                    'claims.status',
                    'claims.claim_template_product_id',
                    'claims.claim_template_product_type',

                    'claims.created_by',
                    'claims.created_at',
                    'claims.updated_by',
                    'claims.updated_at',
                    'claims.delete_by', /* delete_at? schema typo? */
                    'claims.deleted_at',

                    'programs.id AS program_id',
                    'programs.name AS program_name'
                ])
                ->where('claims.program_id', $program['id'])
                ->whereNotIn('claims.status', ['close','ready to close'])
                ->where(function ($query){
                    $query->where('programs.type','factory')->orWhere(function ($query){
                        $query->where('programs.type','volume')->whereNotNull('programs.volume_bbg_rebate');
                    });
                })
                ->limit(1)
                ->orderBy('id', 'desc');

            /* Attach *this* query to the base query. */
            $query->union($additional_claim_query);
        }

        /* Return query builder object so that Lighthouse can paginate with it. */
        return $query;
    }
}
