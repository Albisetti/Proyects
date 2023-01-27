<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class Addresses extends Model {
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'address',
        'address2',
        'zip_postal',
        'city_id',
        'created_by',
        'updated_by'
    ];

    public function state(): HasOne {
        return $this->hasOne(State::class, 'id', 'state_id');
    }

    public function houses() : HasMany {
        return $this->hasMany(Houses::class,'address_id','id');
    }

    public function programs(): HasMany {
        return $this->hasMany(Programs::class, "address_id", "id");
    }

    public function organizations(): HasMany {
        return $this->hasMany(Organizations::class, "address_id", "id");
    }
}
