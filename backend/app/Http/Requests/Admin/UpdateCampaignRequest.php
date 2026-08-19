<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    public function rules(): array
    {
        $campaignId = $this->route('campaign')?->id;

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('campaigns', 'slug')->ignore($campaignId),
            ],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:1024'],
            'category' => ['sometimes', 'string', 'max:64'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after:start_date'],
            'vote_price_kes' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:upcoming,live,ended'],
            'featured' => ['sometimes', 'boolean'],
            'prize' => ['nullable', 'string'],
            'rules' => ['nullable', 'array'],
            'rules.*' => ['string', 'max:500'],
            'sponsors' => ['nullable', 'array'],
            'sponsors.*' => ['string', 'max:255'],
        ];
    }
}
