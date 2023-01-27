<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class RebateReportsProducts extends Pivot
{
//    use HasFactory;

    protected $table = 'rebateReports_products';

    public $incrementing = true;

    protected $fillable = [
        'rebateReport_house_id',
        'product_id',
        'quantity',
        'serial_number',
        'model_number',
        'brand',
        'date_of_purchase',
        'date_of_installation',
//        'distributor', //Confirm if field or relation on pivot
        'distributor_id',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at'
    ];

    public function distributor(): BelongsTo
    {
        return $this->belongsTo(SubContractors::class, 'distributor_id');
    }

    public function relationProducts(): HasMany
    {
        return $this->hasMany(Products::class, 'id','product_id');
    }
}
