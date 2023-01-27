<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Log;
use Laravel\Scout\Searchable;

use App\Helpers\RebateReporting;

class Houses extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        "project_number",
        "model",
        "square_footage",
        "expected_completion_date",
        "status",
        "confirmed_occupancy",
        "organization_id",
        "address",
        "address2",
        "zip_postal",
        "lot_number",
        "city",
        "state_id",
        "purchase_order_id",
        "subdivision_id",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at"
    ];

    protected static function boot() {
        parent::boot();
        static::addGlobalScope('order', function ($house) {
            $house
                ->orderByRaw('LENGTH(zip_postal), zip_postal')
                ->orderByRaw('address+0')
            ;
        });
    }

    public function state(): HasOne
    {
        return $this->hasOne(State::class, 'id', 'state_id');
    }

    public function products():  BelongsToMany
    {
        return $this->belongsToMany(Products::class, "houses_products","house_id","product_id");
    }

    public function organization(): HasOne
    {
        return $this->hasOne(Organizations::class,"id","organization_id");
    }

    public function subdivision(): BelongsTo
    {
        return $this->belongsTo(SubDivision::class,"subdivision_id");
    }

    public function houseFiles(): HasMany
    {
        return $this->hasMany(HouseFiles::class,"house_id");
    }

    public function rebateReports(): BelongsToMany
    {
        return $this
            ->belongsToMany(RebateReports::class, 'rebateReports_houses_products', 'house_id', 'rebateReport_id')
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

    public function incompletedRebateReports(): BelongsToMany
    {
        return $this
            ->belongsToMany(RebateReports::class, 'rebateReports_houses_products', 'house_id', 'rebateReport_id')
            ->wherePivotNotIn('status', ['completed'])
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

    public function rebateReportProducts(): BelongsToMany
    {
        return $this
            ->belongsToMany(Products::class, 'rebateReports_houses_products', 'house_id', 'product_id')
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

    public function incompletedrebateReportProducts(): BelongsToMany
    {
        return $this
            ->belongsToMany(Products::class, 'rebateReports_houses_products', 'house_id', 'product_id')
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

    //Needed in the RebateReportsWhereProductAreInDateRange query, unselectable product relation pivot on the rebateReports above
    public function rebateReports_houses(){
        return $this->hasMany(RebateReportsHousesProducts::class, 'house_id');
    }

    public function programCount(){
        $allPrograms = collect([]);
        $products = $this->products()->get();

        foreach ($products as $product){
            $allPrograms = $allPrograms->merge($product->programs()->get());
        }

        return $allPrograms->count();
	}

    public function toSearchableArray()
    {
        //php artisan scout:flush "App\Models\Houses" && php artisan scout:import "App\Models\Houses"

        $array = $this->toArray();

        if($this->subdivision()->exists()) $array['subdivision_organization_id'] = $this->subdivision()->pluck('organization_id')->toArray();

        return $array;
    }
}
