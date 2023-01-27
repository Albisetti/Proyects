<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RebateReports extends Model
{
//    use HasFactory;

    use SoftDeletes;

    protected $table = 'rebateReports';

    protected $fillable = [
        'name'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id');
    }

    public function rebates(): HasMany
    {
        return $this->hasMany(RebateReportsHousesProducts::class,'rebateReport_id');
    }

    public function houses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function NeedActionHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->wherePivot('status', 'action required') //TODO: fail the whole house or is it ok per product?
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function NeedActionHousesWithCoAndAddress(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->wherePivot('status', 'action required') //TODO: fail the whole house or is it ok per product?
            ->whereNotNull('address')
            ->whereNotNull('confirmed_occupancy')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function NeedActionHousesMissingAddressCount()
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->wherePivot('status', 'action required') //TODO: fail the whole house or is it ok per product?
            ->whereNull('address')
            ->distinct('house_id')
            ->count();
    }

    public function NeedActionHousesMissingCoCount()
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->wherePivot('status', 'action required') //TODO: fail the whole house or is it ok per product?
            ->whereNull('confirmed_occupancy')
            ->distinct('house_id')
            ->count();
    }

    public function ReadiedHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->wherePivot('status', 'rebate ready') //TODO: fail the whole house or is it ok per product?
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function CompletedHouses(): BelongsToMany
    {
        return $this
            ->belongsToMany(Houses::class, 'rebateReports_houses_products', 'rebateReport_id', 'house_id')
            ->wherePivot('status', 'completed') //TODO: fail the whole house or is it ok per product?
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'product_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function products(): BelongsToMany
    {
        return $this
            ->belongsToMany(Products::class, 'rebateReports_houses_products', 'rebateReport_id', 'product_id')
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'house_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }

    public function incompletedProducts(): BelongsToMany
    {
        return $this
            ->belongsToMany(Products::class, 'rebateReports_houses_products', 'rebateReport_id', 'product_id')
            ->wherePivotNotIn('status', ['completed'])
            ->using(RebateReportsHousesProducts::class)
            ->withPivot(
                'id',
                'status',
                'house_id',
                'product_quantity',
                'product_serial_number',
                'product_model_number',
                'product_brand',
                'product_date_of_purchase',
                'product_date_of_installation',
                'subcontractor_provider_id',
                'created_by',
                'updated_by',
                'created_at',
                'updated_at'
            )
            ;
    }
}
