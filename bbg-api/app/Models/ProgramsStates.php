<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Concerns\AsPivot;

class ProgramsStates extends Pivot
{

    protected $table = 'programs_states';

    protected $fillable = [
        'program_id',
        'state_id',
        'created_at',
        'updated_at'
    ];


    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'state_id');
    }

    public function save(array $options = [])
    {
        $results = parent::save($options);
        $this->refresh();

        Programs::where('id',$this->program_id)->searchable();

        return $results;
    }

    public function delete()
    {

        $programId = $this->program_id;
        $results = parent::delete();

        Programs::where('id',$programId)->searchable();

        return $results;
    }
}
