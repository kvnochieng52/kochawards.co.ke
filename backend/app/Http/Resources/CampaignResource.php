<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'featuredImage' => $this->featured_image,
            'category' => $this->category,
            'organizer' => $this->organizer,
            'location' => $this->location,
            'startDate' => optional($this->start_date)?->toIso8601String(),
            'endDate' => optional($this->end_date)?->toIso8601String(),
            'votePriceKes' => $this->vote_price_kes,
            'totalVotes' => (int) $this->getAttribute('total_votes_agg')
                ?? $this->totalVotes(),
            'totalNominees' => (int) ($this->getAttribute('nominees_count')
                ?? $this->nominees()->count()),
            'status' => $this->status,
            'featured' => (bool) $this->featured,
            'prize' => $this->prize,
            'rules' => $this->rules ?? [],
            'sponsors' => $this->sponsors ?? [],
        ];
    }
}
