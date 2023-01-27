<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramDocument extends Model
{
    use HasFactory;

    protected $fillable = ["program_id","path","created_by","updated_by"];
}
