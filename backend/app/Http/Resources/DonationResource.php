<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'program' => $this->program,
            'donorName' => $this->donor_name,
            'phone' => $this->maskPhone($this->phone),
            'amountKes' => (int) $this->amount_kes,
            'status' => $this->status,
            'mpesaReceipt' => $this->mpesa_receipt,
            'mpesaCheckoutRequestId' => $this->mpesa_checkout_request_id,
            'paidAt' => optional($this->paid_at)?->toIso8601String(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
        ];
    }

    private function maskPhone(?string $phone): ?string
    {
        if (!$phone || strlen($phone) < 6) return $phone;
        return substr($phone, 0, 6) . '***' . substr($phone, -3);
    }
}
