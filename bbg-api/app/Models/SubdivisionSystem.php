<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SubdivisionSystem extends Model
{
    use HasFactory;

    protected $table = "subdivisionSystem";

    protected $fillable = ['subdivision_id'];

    public $incrementing = true;

    public function subdivision(): HasOne
    {
        return $this->hasOne(SubDivision::class, 'id','subdivision_id');
    }
}
