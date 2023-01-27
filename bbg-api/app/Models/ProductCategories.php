<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
class ProductCategories extends Model
{
    use Searchable, SoftDeletes;

    protected $table = 'product_categories';

    protected $fillable = [
        'name'
    ];

    public function products(): HasMany
    {
        return $this->hasMany( Products::class, 'category_id' );
    }
}
