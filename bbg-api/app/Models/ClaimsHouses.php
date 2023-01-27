<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ClaimsHouses extends Pivot
{

    protected $table = 'claims_houses';

    protected $fillable = [
        'note',
        'house_id'
    ];

    public $incrementing = true;

    public function ClaimProducts(): HasMany
    {
        return $this->hasMany(ClaimsProducts::class, 'claim_house_id', 'id');
    }
}
