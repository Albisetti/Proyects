<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class programCompanies extends Model
{
    use Searchable, SoftDeletes;

    protected $table = 'programCompanies';

    protected $fillable = [
        'name',
        'category_id'
    ];

    public function programs(): HasMany
    {
        return $this->hasMany(Programs::class, 'company_id');
    }
}
