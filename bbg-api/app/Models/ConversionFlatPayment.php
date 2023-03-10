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

// calc allocations ("original")
// foreach dispute
//    calculate again with override values, then update new_builder/new_total_allocation with overridden-derived calculations
// most recent dispute ends up being the "most valid" data

class ConversionFlatPayment extends Model implements Conversion
{
    use SoftDeletes, ConversionHasSummablePayments;

    protected $table = 'conversionFlatPayment';

    protected $fillable = [
        'name',
        'program_id',
        'amount',
        'anticipated_payment_date',
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

	public function qualified(): bool {
		return $this->paymentSum() >= $this->amount;
	}

	public function qualifiedAt(): ?Carbon {
		$i = 0;
		$qualified_at = NULL;

		$payments = $this->payment()
			->orderBy('payment_date')
			->get();//TODO: Causes an additionnal database call during calculateAllocation
		foreach($payments as $payment) {
			$i += $payment->amount;

			if($i >= $this->amount) {
				$qualified_at = new Carbon($payment->payment_date);
				break;
			}
		}

		return $qualified_at;
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
