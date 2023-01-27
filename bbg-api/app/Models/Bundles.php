<?php

namespace App\Models;

use App\Events\BuilderFirstBundle;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Bundles extends Model
{
    use HasFactory, Searchable, SoftDeletes;

//    protected $table = 'bundles';

    protected $fillable = [
        'name'
    ];

    public function uniquePrograms(): int {
        /* Get all bundle product IDs. */
        $products = $this->products()
            ->get()
            ->pluck('id');
        $product_programs = ProductsPrograms::whereIn('product_id', $products)
            ->distinct('program_id')
            ->count();

        return $product_programs;
    }

    public function products(): BelongsToMany
    {
        return $this
            ->belongsToMany(Products::class, 'bundles_products', 'bundle_id', 'product_id')
            ->withPivot('product_quantity')
            ;
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id');
    }

    public function save(array $options = [])
    {
        $results = parent::save($options);
        $this->refresh();
        $builder = $this->organization()->first();

        if( $builder->bundles()->count() === 1 ){
            event(new BuilderFirstBundle($this, $builder));

        }

        return $results;
    }
}
