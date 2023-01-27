<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationDuePayments extends Model
{
    protected $table = 'dues_payment';

    protected $fillable = [
        'due_id',
        'amount',
        'payment_time',
        'payment_quarter',
        'payment_year',
        'status',
    ];

    public function due(): BelongsTo
    {
        return $this->belongsTo(OrganizationDues::class, 'due_id', 'id');
    }

}
