<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClaimFiles extends Model
{
    use HasFactory;

    protected $fillable = ["claim_id","path","created_by","updated_by"];

    public function claim(): BelongsTo
    {
        return $this->belongsTo(Claims::class, 'claim_id');
    }
}
