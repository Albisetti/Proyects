<?php

namespace App\Models;

use App\Events\CustomProgramAdded;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\DB;

class ProgramParticipants extends Pivot
{
    protected $table = 'programs_participants';

    public $incrementing = true;

    protected $fillable = [
        'program_id',
        'organization_id',
        'overwrite_amount_type',
        'residential_rebate_overwrite',
        'multi_unit_rebate_overwrite',
        'commercial_rebate_overwrite',
        'volume_bbg_rebate',
        'flat_builder_overwrite',
        'flat_bbg_overwrite',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function builder(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id');
    }

    public function save(array $options = [])
    {

        DB::beginTransaction();

        try {
            $rr_rebate_change = false;
            $mu_rebate_change = false;
            $c_rebate_change = false;

            if ($this->exists) {
                if ( (Bool) $this->getRawOriginal('residential_rebate_overwrite') !== $this->residential_rebate_overwrite ) $rr_rebate_change = true;
                if ( (Bool) $this->getRawOriginal('multi_unit_rebate_overwrite') !== $this->multi_unit_rebate_overwrite ) $mu_rebate_change = true;
                if ( (Bool) $this->getRawOriginal('commercial_rebate_overwrite') !== $this->commercial_rebate_overwrite ) $c_rebate_change = true;
            }

            $results = parent::save($options);
            $this->refresh(); //this adds any default if not provided by create/update request

            //If Model save successful and a rebate was changed
            if ($results && ( $rr_rebate_change || $mu_rebate_change || $c_rebate_change )) {
                $updateArray=[];
                if ($rr_rebate_change) $updateArray['residential_rebate_overwrite'] = $this->residential_rebate_overwrite;
                if ($mu_rebate_change) $updateArray['multi_unit_rebate_overwrite'] = $this->multi_unit_rebate_overwrite;
                if ($c_rebate_change) $updateArray['commercial_rebate_overwrite'] = $this->commercial_rebate_overwrite;

                if(!empty($updateArray)) {
                    OrganizationCustomProduct::where('organization_id',$this->organization_id)->where('program_id',$this->program_id)->update($updateArray);
                }
            }
        } catch ( \Exception $ex){
            DB::rollBack();
            throw new \Exception($ex->getMessage());
        }

        DB::commit();

        event( new CustomProgramAdded($this->program()->first(), $this->builder()->first()));

        return $results;
    }
}
