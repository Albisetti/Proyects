<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class OrganizationCustomProduct extends Pivot
{
    use HasFactory;

    protected $table = 'organization_customProducts';
    protected $fillable = [
        'program_id',
        'overwrite_amount_type',
        'residential_rebate_overwrite',
        'multi_unit_rebate_overwrite',
        'commercial_rebate_overwrite',
        'volume_bbg_rebate',
        'flat_builder_overwrite',
        'flat_bbg_overwrite',
    ];


    public function claims(): MorphMany
    {
        return $this->morphMany(Claims::class,'claim_template', 'claim_template_product_type', 'claim_template_product_id', 'product_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id');
    }
}
