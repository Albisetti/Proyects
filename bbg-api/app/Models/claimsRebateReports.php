<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Events\ClaimRebateReportSaved;
use App\GraphQL\Mutations\CalculateClaimAllocation;
use App\Models\RebateReportsHousesProducts;

class claimsRebateReports extends Pivot
{
    public $incrementing = true;

    protected $table = 'claim_rebateReport';

    protected $fillable = [
        'rebateReport_id',
        'claim_id',
        'rebate_earned',
        'rebate_adjusted',
        'builder_allocation',
        'total_allocation',
        'note',
        'created_by',
        'updated_by',
        'approved_at'
    ];

    public function rebateReport(): BelongsTo
    {
        return $this->belongsTo(RebateReportsHousesProducts::class, 'rebateReport_id');
    }

    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claims::class, 'claim_id');
    }

    public function save(array $options = [])
    {

//        Log::info("L331: Starting to do claimRebateReportSave that might be expensive at ". microtime(true));

        DB::beginTransaction();
        try {
            $results = parent::save($options);
            $this->refresh();

            //This take cares of both Volume and Factory claims
            if( isset($this->approved_at) ){
                $rebate = $this->rebateReport()->first();
                $rebate->status = 'completed';
                $rebate->save();
            }
            DB::commit();
        } catch (\Exception $ex){
            DB::rollBack();
            throw $ex;
        }

        //TODO: up to here it takes 12s
//        Log::info("L333: Did the claimRebateReportSave pre event , doing something else at ". microtime(true));


//        if(!isset($options['side_effect'])) {
//			event(new ClaimRebateReportSaved($this));
//		}
//
//        Log::info("L333: Did the claimRebateReportSave, doing something else at ". microtime(true));

		return $results;
    }

    public function delete()
    {

        DB::beginTransaction();

        try {

            $claim = $this->claim()->first();

            if ( in_array($claim->status, ['open','ready'])  ){
                $claim->status = 'open';
                $claim->save();
            } else {
                throw new \Exception("Claim as already been submitted");
            }

            $result=parent::delete();

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        return $result;
    }
}
