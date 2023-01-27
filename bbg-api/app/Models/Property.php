<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

//Also know as property by client
class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "properties";

    protected $fillable = [
        "name",
        "organization_id"
    ];

//    public function houses(): BelongsToMany
//    {
//        //return $this->hasMany(Houses::class, 'house_id', 'id');
//        return $this->belongsToMany(Houses::class,"houses_properties","property_id","house_id");
//    }


    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'organizations_properties','property_id', 'organization_id');
    }

    public function subdivisions(): HasMany
    {
        return $this->hasMany(SubDivision::class, 'property_id','id');
    }
}
