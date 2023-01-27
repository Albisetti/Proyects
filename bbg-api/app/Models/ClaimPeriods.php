<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClaimPeriods extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'claimPeriods';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'quarter',
        'year',
        'archived_by',
        'archived_at',
    ];

    public function claims(): HasMany
    {
        return $this->hasMany(Claims::class, 'claimPeriod_id', 'id');
    }

    public function archived_by(): BelongsTo
    {
        $this->belongsTo(User::class, 'archived_by', 'id');
    }

    public function readyForClose(){
        $unCompletedClaims = $this->claims()->where('status','close')->count();

        return ( $unCompletedClaims === 0 );
    }
}
