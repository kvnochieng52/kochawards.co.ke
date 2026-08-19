<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreNomineeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_admin === true;
    }

    public function rules(): array
    {
        return [
            'campaign_id' => ['required', 'integer', 'exists:campaigns,id'],
            'code' => ['required', 'string', 'max:32', 'unique:nominees,code'],
            'full_name' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:1024'],
            'cover_photo' => ['nullable', 'string', 'max:1024'],
            'headline' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:128'],
            'verified' => ['sometimes', 'boolean'],
            'achievements' => ['nullable', 'array'],
            'achievements.*' => ['string', 'max:500'],
            'website' => ['nullable', 'string', 'max:1024'],
            'socials' => ['nullable', 'array'],
            'socials.twitter' => ['nullable', 'string', 'max:255'],
            'socials.instagram' => ['nullable', 'string', 'max:255'],
            'socials.facebook' => ['nullable', 'string', 'max:255'],
            'socials.tiktok' => ['nullable', 'string', 'max:255'],
            'socials.youtube' => ['nullable', 'string', 'max:255'],
            'socials.linkedin' => ['nullable', 'string', 'max:255'],

            'role' => ['nullable', 'string', 'max:255'],
            'organization' => ['nullable', 'string', 'max:255'],
            'years_of_service' => ['nullable', 'integer', 'min:0', 'max:120'],
            'people_reached' => ['nullable', 'integer', 'min:0'],
            'age' => ['nullable', 'integer', 'min:0', 'max:150'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:64'],

            'chairperson' => ['nullable', 'string', 'max:255'],
            'member_count' => ['nullable', 'integer', 'min:0'],
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:2100'],
            'amount_mobilized_kes' => ['nullable', 'integer', 'min:0'],
            'registration_no' => ['nullable', 'string', 'max:255'],
            'meeting_cadence' => ['nullable', 'string', 'max:255'],

            'programs' => ['nullable', 'array'],
            'programs.*' => ['string', 'max:500'],
        ];
    }
}
