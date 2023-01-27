<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductsPrograms extends Pivot
{

    protected $table = 'products_programs';

    protected $fillable = [
        'program_id',
        'product_id',
        'minimum_unit',
        'rebate_amount_type',
        'require_quantity_reporting',
        'residential_rebate_amount',
        'multi_unit_rebate_amount',
        'commercial_rebate_amount',
        'volume_bbg_rebate',
        'multi_reporting'
    ];

    public $incrementing = true;

    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }

    public function claimTemplateExist(){

        if( isset($this->volume_bbg_rebate) && $this->volume_bbg_rebate !== 0 ) return true;
        $product = Products::find($this->product_id);
        $organizationOverwrites = $product->organizationOverwrites()
            ->where('organization_customProducts.program_id',$this->program_id)
            ->whereNotNull('organization_customProducts.volume_bbg_rebate')
            ->count();
        if( $organizationOverwrites >= 1 ) return true;

        return false;
    }

    public function claims(): MorphMany
    {
        return $this->morphMany(Claims::class,'claim_template', 'claim_template_product_type', 'claim_template_product_id', 'product_id');
    }

    public function save(array $options = [])
    {

        if ($this->exists) {
            $multi_reporting_change = false;

            //if multi_reporting has been changed
            if ( (Bool) $this->getRawOriginal('multi_reporting') !== $this->multi_reporting ) $multi_reporting_change = true;
        } else {
            $multi_reporting_change = true;
        }

        $results = parent::save($options);
        $this->refresh(); //this adds the default multi_reporting if no provided by create/update request

        //If Model save successful and multi_reporting was changed
        if ( $results && $multi_reporting_change ) {
            ProductsPrograms::where( 'product_id', $this->product_id )->update(['multi_reporting'=>$this->multi_reporting]);
            //TODO: this would turn off multi-reporting too, is that fine?
        }



        return $results;
    }
}
