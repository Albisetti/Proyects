<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use function Aws\filter;

class SubContractors extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
//        'organization_id',
        'company_name',
        'contact_name',
        'email',
        'office_number',
        'office_number_ext',
        'mobile_number',
        'address_id',
        'state_id',
        'city',
        'address',
        'address2',
        'zip_postal',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
        'archived_by',
        'archived_at'
    ];

//    public function address() : HasOne
//    {
//        return $this->hasOne(Addresses::class, "id", "address_id");
//    }

    public function state() : HasOne
    {
        return $this->hasOne(State::class, "id", "state_id");
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organizations::class, 'subContractor_organization', 'subcontractor_id', 'organization_id');
    }

    public function toSearchableArray()
    {
        //php artisan scout:flush "App\Models\SubContractors" && php artisan scout:import "App\Models\SubContractors"

        $array = $this->toArray();

//        unset($array["contact_name"]);
        if($this->organizations()->exists()) $array['organizations'] = $this->organizations()->pluck('organizations.id')->toArray();

        return $array;
    }
}
