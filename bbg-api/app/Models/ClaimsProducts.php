<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ClaimsProducts extends Model
{
    protected $table = 'claims_products';

    protected $fillable = [
        'product_id',
        'note',
        'quantity',
        'created_at',
        'updated_at'
    ];

    public function ClaimHouses(): HasMany
    {
        return $this->hasMany(ClaimsHouses::class, 'id', 'claim_house_id');
    }

    public function Product(): HasOne
    {
        return $this->hasOne(Products::class, 'id', 'product_id');
    }
}
