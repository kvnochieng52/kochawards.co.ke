<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InitiateDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'program' => ['nullable', 'string', 'max:64'],
            'donor_name' => ['nullable', 'string', 'max:120'],
            'phone' => ['required', 'string', 'regex:/^(\+?254|0)[17]\d{8}$/'],
            'amount' => ['required', 'integer', 'min:10', 'max:300000'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678).',
            'amount.min' => 'Minimum donation is KES 10.',
            'amount.max' => 'Donation above KES 300,000 — please contact us for direct arrangements.',
        ];
    }
}
