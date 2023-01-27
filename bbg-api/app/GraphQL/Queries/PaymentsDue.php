<?php

namespace App\GraphQL\Queries;

use App\Models\Programs;
use App\Helpers\ConversionHelpers;
use Carbon\Carbon;

/*
 * !! Not to be confused with any overlapping concept of organizational dues.
 * 
 * PaymentsDue is explicitly the difference between a conversion's qualifying trigger
 * amount and the current measured value.
 */
class PaymentsDue
{
    /**
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        $program = NULL;

        if(isset($args['program_id'])) {
            $program_id = $args['program_id'];

            $program = Programs::find($program_id);
            if(!$program) {
                throw new \Exception('Tried to retrieve conversion payments due for a bad program ID.');
            }
        }

        /* Pass false because we want only conversions that are *not* qualified. */
        $unqualified_conversions = ConversionHelpers::getConversions($program, false);
        $conversions = [];

        foreach($unqualified_conversions as $conversion) {
            $conversion_class = get_class($conversion);
            $due_date = NULL;
            $note = NULL;
            $payment_owed = NULL;

            switch($conversion_class) {
                case "App\\Models\\ConversionFlatPayment":
                    $payment_owed = $conversion->amount - $conversion->paymentSum();
                    $due_date = new Carbon($conversion->anticipated_payment_date);
                    break;

                /* If this conversion type is not time-sensitive, we can skip it here */
                case "App\\Models\\ConversionByActivity":
                    if($conversion->measure_unit === 'money') {
                        $payment_owed = $conversion->trigger_amount - $conversion->paymentSum();
                        break;
                    } else {
                        /* We want to 'continue' at the for-each level, NOT break the switch statement */
                        continue 2;
                    }

                case "App\\Models\\ConversionTieredPercent":
                    /* Consider only the sum of payments in this conversion's valid payment period. */
                    $period = $conversion->getValidPaymentPeriod();
                    $payments = $conversion->paymentSum($period);
                    $tiers = $conversion->tiers()->get();
                    $sorted = $tiers->sortByDesc(function($elem) {
                        return $elem['spend_exceed'];
                    });

                    $next_qualifying_tier = NULL;

                    /* In DESC order, return the first tier for which we exceed the relevant spend. */
                    foreach($sorted as $tier) {
                        if($payments < $tier->spend_exceed) {
                            $next_qualifying_tier = $tier;
                        }
                    }

                    if(!$next_qualifying_tier) {
                        continue 2;
                    }

                    $due_date = $conversion->anticipated_payment_date;
                    $note = $next_qualifying_tier->note;
                    $payment_owed = $next_qualifying_tier->spend_exceed - $payments;
                    break;

                default:
                    throw new \Exception('Trying to anticipate owed for bad conversion type.');
                    continue 2;
            }

            /*
             * We have a handle to the conversion $model, the $program, and we know that
             * any conversion we're looking at does not yet qualify.
             * 
             * We need to find the difference and the due_date.
             */
            $conversions[] = [
                'program' => $conversion->program,
                'conversion' => $conversion,
                'due_date' => $due_date,
                'note' => $note,
                'payment_owed' => $payment_owed
            ];
        }

        $response = [
            "conversionPaymentDue" => $conversions
        ];

        return $response;
    }
}
