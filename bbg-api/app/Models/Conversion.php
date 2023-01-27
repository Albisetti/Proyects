<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonPeriod;

trait ConversionHasSummablePayments {
    /**
     * Calculate the sum paid towards a specific conversion.
     *
     * @param CarbonPeriod|null $relevant_period If present, only consider payments within this range.
     * @return float
     */
    public function paymentSum($relevant_period = NULL): float {
        /* Not constrained within time. */
        if(!$relevant_period) {
            return $this->payment
//                ->get()
                ->sum('amount');
        }

        /* We may receive a period object with a start, but no end. */
        if($relevant_period->isEndExcluded()) {
            return $this->payment
                ->where('payment_date', '>', $relevant_period->getStartDate()->format('Y-m-d'))
//                ->get()
                ->sum('amount');
        }

        /* Return the sum of all conversion payments within the passed CarbonPeriod object. */
        return $this->payment
            ->whereBetween('payment_date', [
                $relevant_period->getStartDate()->format('Y-m-d'),
                $relevant_period->getEndDate()->format('Y-m-d')
            ])
//            ->get()
            ->sum('amount');
    }
}

trait HasTimeSensitivePayments {
    /**
     * @return CarbonPeriod A Carbon representation of the period for which payments "count" against this conversion.
     */
    public function getValidPaymentPeriod(): CarbonPeriod {
        /*
         * The polymorphic conversion type has differing fields which represent the period of
         * payment validity from the base clock_start value; ensure we're using the correct field
         * or throw if this utility was misused.
         */
        $payment_period = isset($this->spend_time_range)
            ? $this->spend_time_range
            : (isset($this->valid_period)
                ? $this->valid_period
                : NULL);
        if(!$payment_period || !in_array($payment_period, \App\Helpers\VALID_CONVERSION_PAYMENT_PERIODS) || !$this->clock_start) {
            throw new \Exception('Trying to calculate payment period for conversion with an undefined interval.');
        }

        $horizon = new CarbonPeriod($this->clock_start);
        $end_date = new Carbon($this->clock_start);

        switch($payment_period) {
            // Considerations for enum('year', 'quarter', 'month', 'all')
            case 'month':
                $end_date->modify('+1 month');
                break;

            case 'year':
                $end_date->modify('+1 year');
                break;

            case 'quarter':
                $horizon->setEndDate($end_date->endOfQuarter());
                break;

            case 'all':
            default:
                break;
        }

        /* Leave end date unspecified if the period is "all" after the clock_start date */
        if('all' !== $payment_period && 'quarter' !== $payment_period) {
            $horizon->setEndDate($end_date);
        }

        /* Return the CarbonPeriod object */
        return $horizon;
    }
}

/* Conversions, generally, require "qualification" to be used during allocation calculation */
interface Conversion {
    /**
     * @return bool|ConversionTieredPercentTier For all conversions except percentage tiers, this is strictly a boolean result, else it is either "false" or the qualified tier model instance.
     */
    function qualified();

	/**
	 * @return null|Carbon A Carbon object representing the point at which a conversion qualified, else null if either N/A or not a qualified conversion.
	 */
	function qualifiedAt();
}

/* Conversions which enforce time-sensitivity on payments */
interface TimedConversion extends Conversion {
    /**
     * @return CarbonPeriod A Carbon date range under which this conversion's payments are considered relevant.
     */
    function getValidPaymentPeriod();
}
