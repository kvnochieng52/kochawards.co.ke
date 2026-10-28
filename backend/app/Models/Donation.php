<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'program',
        'donor_name',
        'phone',
        'amount_kes',
        'status',
        'mpesa_merchant_request_id',
        'mpesa_checkout_request_id',
        'mpesa_receipt',
        'mpesa_response',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'amount_kes' => 'integer',
            'paid_at' => 'datetime',
        ];
    }
}
