<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SystemMessage extends Model
{
    use SoftDeletes;

    public $table = 'systemMessage';

    protected $fillable = [
        'message',
        'message_action',
        'user_id',
        'related_entity_type',
        'related_entity_id',
        'sent_date',
        'read_date',
        'deleted_at'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function related_entity(): MorphTo
    {
        return $this->morphTo('related_entity', 'related_entity_type', 'related_entity_id');
    }
}
