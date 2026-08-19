<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCampaignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:campaigns,slug'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:1024'],
            'category' => ['required', 'string', 'max:64'],
            'organizer' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'vote_price_kes' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:upcoming,live,ended'],
            'featured' => ['sometimes', 'boolean'],
            'prize' => ['nullable', 'string'],
            'rules' => ['nullable', 'array'],
            'rules.*' => ['string', 'max:500'],
            'sponsors' => ['nullable', 'array'],
            'sponsors.*' => ['string', 'max:255'],
        ];
    }
}
