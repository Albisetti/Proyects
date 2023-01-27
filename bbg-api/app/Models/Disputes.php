<?php

namespace App\Models;

use App\Events\ClaimRebateReportSaved;
use App\Events\DisputeCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class Disputes extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_id',
        'rebateReportHouseProduct_id',
        'organization_id',
        'status',
        'note',
        'new_product_quantity',
        'new_rebate_earned',
        'new_rebate_adjusted',
        'new_builder_allocation',
        'new_total_allocation',
        "created_by",
        'updated_by',
        'created_at',
        'updated_at'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id');
    }

    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claims::class, 'claim_id');
    }

    public function rebateReport(): BelongsTo
    {
        return $this->belongsTo(RebateReportsHousesProducts::class, 'rebateReportHouseProduct_id');
    }

    public function save(array $options = [])
    {

        try {
            $results = parent::save($options);

            $claim = $this->claim()->first();
            if ( !in_array($claim->status, ['ready to close','close']) ){
                $claim->status = 'disputed';
                $claim->save();
            }

            if(!isset($options['claimDisconnect']) || $options['claimDisconnect']){
                if( isset($this->rebateReportHouseProduct_id) && !empty($this->rebateReportHouseProduct_id) ){
                    DB::delete(
                        "delete claim_rebateReport from claim_rebateReport left join claims on claim_rebateReport.claim_id = claims.id where rebateReport_id = ? and status not in ('ready to close','close');",
                        [$this->rebateReportHouseProduct_id]
                    );
                }
            }

        } catch (\Exception $ex){
            throw $ex;
        }

        event(new DisputeCreated($this));

        return $results;
    }
}
