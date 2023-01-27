<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramFiles extends Model
{

    protected $table = 'program_documents';

    protected $fillable = ['program_id','path','created_by','updated_by'];

    public static function getRelationKey()
    {
        return 'program_id';
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id');
    }
}
