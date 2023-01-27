<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganizationDues extends Model
{
    protected $table = 'organization_dues';

    protected $fillable = [
        'organization_id',
        'annual_dues',
        'prorated_amount',
        'start_date'
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organizations::class, 'organization_id', 'id');
    }

    public function duePayments(): HasMany
    {
        return $this->hasMany(OrganizationDuePayments::class, 'due_id', 'id');
    }

    public function totalPayed(){
        $total = 0;

        if ( $this->duePayments()->exists() ){
            foreach ( $this->duePayments()->get() as $payment ){
                $total += $payment->amount;
            }
        }

        return $total;
    }

    public function dueLeft(){
        $total = ( !isset($this->prorated_amount) ? $this->prorated_amount : $this->annual_dues );

        if ( $this->duePayments()->exists() ){
            foreach ( $this->duePayments()->get() as $payment ){
                $total -= $payment->amount;
            }
        }

        return $total;
    }

    public function totalPayedQuarter($quarter, $year){
        $total = 0;

        if ( $this->duePayments()->exists() ){
            foreach ( $this->duePayments()->where(function ($query)use($quarter,$year){
                $query->where('payment_quarter',$quarter)
                    ->where('payment_year',$year)
                ;
            })->get() as $payment ){
                $total += $payment->amount;
            }
        }

        return $total;
    }

    public function dueLeftQuarter($quarter,$year)
    {
        $total = (isset($this->prorated_amount) ? $this->prorated_amount : $this->annual_dues);
        if (!isset($total)) $total = 0;

        if ($this->duePayments()
            ->where(function ($query) use ($quarter, $year) {
                $query->where('payment_quarter', '<=', $quarter)->where('payment_year', '<=', $year);
            })
            ->exists()) {
            foreach ($this->duePayments()
                         ->where(function ($query) use ($quarter, $year) {
                             $query->where('payment_quarter', '<=', $quarter)->where('payment_year', '<=', $year);
                         })
                         ->get() as $payment) {
                $total -= $payment->amount;
            }
        }

        return $total;
    }
}
