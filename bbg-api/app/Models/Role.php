<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Role
 *
 * @method static Builder|Role newModelQuery()
 * @method static Builder|Role newQuery()
 * @method static Builder|Role query()
 * @mixin Eloquent
 */
class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $casts = [
        'capabilities' => 'array'
    ];

    protected $fillable = [
        'name',
        'capabilities'
    ];
}
