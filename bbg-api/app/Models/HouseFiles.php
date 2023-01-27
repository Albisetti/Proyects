<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HouseFiles extends Model
{
    use HasFactory;

    protected $fillable = ["house_id","path","created_by","updated_by"];

    public static function getRelationKey()
    {
        return "house_id";
    }

    public function house(): BelongsTo
    {
        return $this->belongsTo(Houses::class, 'house_id');
    }
}
