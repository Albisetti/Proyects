<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequiredProofPoints extends Model
{
    use HasFactory;

    protected $fillable = ["proof_name"];
}
