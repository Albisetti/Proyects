<?php

namespace App\Models;

use App\Events\TerritoryManagerAssigned;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class builders_territoryManagers extends Pivot
{

    protected $table = 'organizations_territoryManagers';

    protected $fillable = [
        'organization_id',
        'user_id'
    ];

    public $incrementing = true;

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id', 'id');
    }

    public function territoryManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function save(array $options = [])
    {
        $results = parent::save($options);
        $this->refresh();

        $org = $this->organization()->first();
        $TM = $this->territoryManager()->first();

        if ($org->organization_type === 'builders') {
            event(new territoryManagerAssigned($org, $TM));
        }

        return $results;
    }
}
