<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConversionTieredPercentTier extends Model
{
    use SoftDeletes;

    protected $table = 'conversionTiered_tier';

    protected $fillable = [
        'conversion_id',
        'bonus_amount',
        'spend_exceed',
        'note',
        'created_by',
        'updated_by'
    ];

    public function conversion(): BelongsTo
    {
        return $this->belongsTo(ConversionTieredPercent::class, 'conversion_id');
    }
}
