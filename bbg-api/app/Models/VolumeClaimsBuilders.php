<?php

namespace App\Models;

use App\Events\VolumeClaimsBuildersSaved;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\DB;

class VolumeClaimsBuilders extends Pivot
{
    protected $table = 'volumeClaims_builders';
    public $incrementing = true;
    protected $fillable = [
        'id',
        'builder_id',
        'volumeClaim_id',
        'rebate_earned',
        'rebate_adjusted',
        'builder_allocation',
        'total_allocation',
        'note',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'approved_at'
    ];

    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claims::class, 'volumeClaim_id');
    }

    public function builder(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'builder_id');
    }

    public function save(array $options = [])
    {

        DB::beginTransaction();

        try {
            $results = parent::save($options);
            $this->refresh(); //this adds the default multi_reporting if no provided by create/update request

            $this->attachAssociateRebateToClaim();

            if (!isset($options['skipAllocation'])) $this->calculateAllocation();

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }

        return $results;
    }

    public function delete()
    {
        $claim = $this->claim()->first();

        if( in_array($claim->status, ['submitted','disputed','ready to close','close']) ) throw new \Exception('Claim as already been submitted, cannot modify');

        DB::beginTransaction();

        try {
            $rebates = claimsRebateReports::where('claim_id',$this->volumeClaim_id)->with(['rebateReport'])->get();
            foreach ( $rebates as $rebate ){
                $rebateOrgId = $rebate->rebateReport->rebateReports()->first()->organization_id;
                if( $rebateOrgId == $this->builder_id ){
                    $rebate->delete();
                }
            }

            parent::delete();

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }
    }

    private function attachAssociateRebateToClaim(){

        $volumeClaimBuilder = $this;

        DB::beginTransaction();
        try {
            $claim = $volumeClaimBuilder->claim()->first();

            $rebates = RebateReportsHousesProducts::
            whereHas('rebateReports', function ($query)use($volumeClaimBuilder){
                $query->where('organization_id',$volumeClaimBuilder->builder_id);
            })
                ->where('status','!=','completed') //TODO: check if need to remove this check or not
                ->whereDate('created_at', '<=',$claim->claim_end_date)
                ->with(['products','products.programs'])
                ->get();

            $rebateIds = collect();

            foreach ($rebates as $rebate ){
                if( isset($rebate->products) && $rebate->products->programs->contains('id',$claim->program_id)) { //contains is doing DB for some reason.
                    if(!$rebateIds->contains($rebate->id)) $rebateIds->push($rebate->id);
                }
            }

            //TODO: about 1s to get to here
            if(!$rebateIds->isEmpty()) {

                $inputString = '';
                $updateString = '';
                $inputValues = [];

                $index = 0;
                foreach ($rebateIds as $rebateId){
                    if( $index >=1 ){
                        $inputString.=',';
                        $updateString.=',';
                    }
                    $inputString .= '(?,?)';
                    $updateString .= '?';

                    $inputValues[] = $rebateId;
                    $inputValues[] = $claim->id;

                    $index++;
                }

                //Since we are allocating on volumeClaim-builder and not rebate, we don't need to call the calculateAllocation on claim-rebateReport
                //Since we are using sql insert, save function is not being call skipping calculateAllocation
                //TODO: ensure it doesn't create duplicates?
                DB::insert("INSERT INTO `claim_rebateReport` (`rebateReport_id`, `claim_id`) VALUES ".$inputString,$inputValues);

                //We are however lossing the rebate status change to completed, do another udpate
                DB::update("UPDATE `rebateReports_houses_products` set `status` = 'completed' where id in (".$updateString.")",$rebateIds->toArray());
            }

            DB::commit();
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }
    }

    private function calculateAllocation()
    {
        event( new VolumeClaimsBuildersSaved($this));
    }
}
