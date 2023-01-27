<?php

namespace App\Models;

use App\Helpers\ClaimReporting;
use Carbon\Carbon;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Sentry\Util\JSON;

use App\Models\RebateReportsHousesProducts;

class ConversionByActivity extends Model implements Conversion
{
    use SoftDeletes, ConversionHasSummablePayments;

    protected $table = 'conversionByActivity';

    protected $fillable = [
        'name',
        'program_id',
        'measure_unit',
        'trigger_amount',
        'bonus_name',
        'bonus_type',
        'bonus_amount',
        'product_included',
        'created_by',
        'updated_by'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Products::class, 'conversionByActivity_products', 'conversion_id','product_id')
            ->withPivot(
                'new_rebate_amount'
            );
            ;
    }

	public function getActivityMeasure($required = false): float|array {
		$program_products = null;

		if($this->product_included === 'all') {
			$program_products = $this->program->products(); //TODO:Opt
		} else if($this->product_included === 'specifics') {
			$program_products = $this->products(); //TODO:Opt
		} else {
			throw new \Exception("Checking qualification for conversion {$this->id} with an invalid product_included value.");
		}

		if($required) {
			return $this->trigger_amount;
		}

		switch($this->measure_unit) {
			/*
			 * The money measure_unit is functionally identical to flat payment conversions, but allows for
			 * multiple tiers.
			 */
			case 'money':
				return $this->paymentSum();

			case 'property':
				$products = $program_products->get(); //TODO:Opt
				$houses = collect([]);

				foreach($products as $product) {
					$product_houses = $product->rebateReportHouses()->pluck('house_id');
					$houses = $houses->merge($product_houses);
				}

				$total_houses = $houses->unique()->count();
				return $total_houses;

			/*
			 * For the 'product' measure_unit, ensure that all considered products have at least
			 * trigger_amount reported.
			 */
			case 'product':
				$products = $program_products->get(); //TODO:Opt

				$product_measure = [];

				foreach($products as $product) {
					$product_measure[$product->id] = [
						'product_id' => $product->id,
						'quantity' => $product->product_quantity
					];
				}

				return $product_measure;

			default:
				return 0;
		}

		return 0;
	}

	public function qualifiedAt(): ?Carbon {
		$program_products = null;

		if($this->product_included === 'all') {
			$program_products = $this->program->products();
		} else if($this->product_included === 'specifics') {
			$program_products = $this->products();
		} else {
			throw new \Exception("Checking qualification for conversion {$this->id} with an invalid product_included value.");
		}

		switch($this->measure_unit) {
			/*
			 * The money measure_unit is functionally identical to flat payment conversions, but allows for
			 * multiple tiers.
			 */
			case 'money':
				$i = 0;
				$payments = $this->payment()
					->orderBy('payment_date')
					->get();
				foreach($payments as $payment) {
					$i += $payment->amount;

					if($i >= $this->amount) {
						return new Carbon($payment->payment_date);
					}
				}

			case 'product':
				$product_ids = $program_products->pluck('product_id');
				$products = RebateReportsHousesProducts::whereIn('product_id', $product_ids);

				foreach($products->get() as $product) {
					if($product->product_quantity <= $this->trigger_amount) {
						$products = RebateReportsHousesProducts::whereIn('product_id', $product_ids);
					}
				}

				/**
				 * TODO! Need historical "triggered at" for these.
				 */
				return new Carbon();

			default:
				break;
		}

		return null;
	}

    public function payment(): MorphMany
    {
        return $this->morphMany(ConversionPayment::class, 'conversion');
    }

	public function qualified(): bool {
		$program_products = null;

		if($this->product_included === 'all') {
			$program_products = $this->program->products();
		} else if($this->product_included === 'specifics') {
			$program_products = $this->products();
		} else {
			throw new \Exception("Checking qualification for conversion {$this->id} with an invalid product_included value.");
		}

		switch($this->measure_unit) {
			case 'money':
				return $this->paymentSum() >= $this->trigger_amount;

			case 'property':
				$products = $program_products->get();
				$houses = collect([]);

				foreach($products as $product) {
					$product_houses = $product->rebateReportHouses()->pluck('house_id');
					$houses = $houses->merge($product_houses);
				}

				$total_houses = $houses->unique()->count();

				return $total_houses >= $this->trigger_amount;

			/*
			 * For the 'product' measure_unit, ensure that all considered products have at least
			 * trigger_amount reported.
			 */
			case 'product':
				$product_ids = $program_products->pluck('product_id');
				$products = RebateReportsHousesProducts::whereIn('product_id', $product_ids);

				foreach($products->get() as $product) {
					if($product->product_quantity <= $this->trigger_amount) {
						return false;
					}
				}

				return true;

			default:
				break;
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
