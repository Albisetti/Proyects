<?php

namespace App\Models;

use App\Helpers\ClaimReporting;
use Carbon\Carbon;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConversionTieredPercent extends Model implements Conversion
{
    use SoftDeletes, ConversionHasSummablePayments, HasTimeSensitivePayments;

    protected $table = 'conversionTierPercent';

    protected $fillable = [
        'name',
        'program_id',
        'anticipated_payment_date',
        'max_amount',
        'valid_period',
        'clock_start',
        'created_by',
        'updated_by'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function payment(): MorphMany
    {
        return $this->morphMany(ConversionPayment::class,'conversion');
    }

    public function tiers(): HasMany
    {
        return $this->hasMany(ConversionTieredPercentTier::class, 'conversion_id');
    }

	public function qualifiedAt(): ?Carbon {
		return null;
	}

	public function qualified(): bool|ConversionTieredPercentTier {
		/*
		 * Get all tiers associated with this conversion, sort descending on the spend
		 * threshold.
		 */
		$tiers = $this->tiers->get();
		$sorted = $tiers->sortByDesc(function($elem) {
			return $elem['spend_exceed'];
		});

		/* Consider only the sum of payments in this conversion's valid payment period. */
		$period = $this->getValidPaymentPeriod();
		$payments = $this->paymentSum($period);

		/* In DESC order, return the first tier for which we exceed the relevant spend. */
		foreach($sorted as $tier) {
			if($payments > $tier->spend_exceed) {
				return $tier;
			}
		}

		return false;
	}

    public function save(array $options = [])
    {
        $results = parent::save($options); // TODO: Change the autogenerated stub
        $this->refresh();

        //TODO: put in transaction
        try {
            //Out-dated due to too much change to be done on a save, please use the graphql calculateClaimAllocation mutation to newly created
//            $program = $this->program()->first();
//            $claims = Claims::where('program_id',$program->id)
//                ->whereNotIn('status',['ready to close', 'close'])
//                ->has('rebateReports')
//                ->get()
//            ;
//
//            foreach ( $claims as $claim ){
//                $rebates = $claim->rebateReports()->get();
//
//                if( !empty($rebates) ){
//                    foreach ( $rebates as $rebate ){
//
//                        $claim_rebate = $rebate->pivot;
//                        ClaimReporting::calculateAndSetClaimTotal($claim_rebate);
//                    }
//                }
//            }
        } catch (\Exception $ex){
            throw $ex;
        }

        return $results;
    }
}
