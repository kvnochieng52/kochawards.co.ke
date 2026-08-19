<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'nomineeId' => (string) $this->nominee_id,
            'campaignId' => (string) $this->campaign_id,
            'phone' => $this->maskPhone($this->phone),
            'amountKes' => (int) $this->amount_kes,
            'voteCount' => (int) $this->vote_count,
            'status' => $this->status,
            'mpesaReceipt' => $this->mpesa_receipt,
            'mpesaCheckoutRequestId' => $this->mpesa_checkout_request_id,
            'paidAt' => optional($this->paid_at)?->toIso8601String(),
            'createdAt' => optional($this->created_at)?->toIso8601String(),
            'nominee' => $this->whenLoaded('nominee', fn () => [
                'id' => (string) $this->nominee->id,
                'code' => $this->nominee->code,
                'fullName' => $this->nominee->full_name,
                'photo' => $this->nominee->photo,
            ]),
        ];
    }

    private function maskPhone(?string $phone): ?string
    {
        if (!$phone || strlen($phone) < 6) return $phone;
        return substr($phone, 0, 6) . '***' . substr($phone, -3);
    }
}
