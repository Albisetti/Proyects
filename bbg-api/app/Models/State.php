<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\State
 *
 * @property-read Collection|\App\Models\City[] $cities
 * @property-read int|null $cities_count
 * @method static Builder|State newModelQuery()
 * @method static Builder|State newQuery()
 * @method static Builder|State query()
 * @mixin Eloquent
 */
class State extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'states';

    protected $fillable = ['id', 'name', 'iso_code', 'country'];

    protected static function boot() {
        parent::boot();
        static::addGlobalScope('order', function ($builder) {
            $builder
                ->orderBy('country')
                ->orderBy('name')
            ;
        });
    }

    public function cities(): HasMany
    {
        return $this->hasMany(City::class, 'state_id', 'id');
    }

    //https://www.iso.org/obp/ui/#iso:code:3166:US
    //https://www.iso.org/obp/ui/#iso:code:3166:CA
    public static $stateID = [
        'AL' => 35,
        'AK' => 32,
        'AZ' => 6,
        'AR' => 37,
        'CA' => 2,
        'CO' => 15,
        'CT' => 42,
        'DE' => 47,
        'DC' => 16,
        'FL' => 7,
        'GA' => 26,
        'HI' => 31,
        'ID' => 34,
        'IL' => 3,
        'IN' => 8,
        'IA' => 36,
        'KS' => 29,
        'KY' => 18,
        'LA' => 30,
        'ME' => 48,
        'MD' => 17,
        'MA' => 13,
        'MI' => 11,
        'MN' => 28,
        'MS' => 40,
        'MO' => 24,
        'MT' => 46,
        'NE' => 27,
        'NV' => 22,
        'NH' => 44,
        'NJ' => 33,
        'NM' => 23,
        'NY' => 1,
        'NC' => 10,
        'ND' => 45,
        'OH' => 9,
        'OK' => 20,
        'OR' => 19,
        'PA' => 5,
        'RI' => 39,
        'SC' => 43,
        'SD' => 41,
        'TN' => 12,
        'TX' => 4,
        'UT' => 38,
        'VT' => 51,
        'VA' => 25,
        'WA' => 14,
        'WV' => 50,
        'WI' => 21,
        'WY' => 49,
        'AB' => 53,
        'BC' => 54,
        'MB' => 55,
        'NB' => 56,
        'NL' => 57,
        'NT' => 58,
        'NS' => 59,
        'NU' => 60,
        'ON' => 61,
        'PE' => 62,
        'QC' => 63,
        'SK' => 64,
        'YT' => 65,
    ];
}
