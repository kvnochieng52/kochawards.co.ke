<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'nominee_id',
        'campaign_id',
        'phone',
        'amount_kes',
        'vote_count',
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
            'vote_count' => 'integer',
            'paid_at' => 'datetime',
        ];
    }

    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }
}
