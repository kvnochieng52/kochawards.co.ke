<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InitiateVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nominee_id' => ['required', 'integer', 'exists:nominees,id'],
            'phone' => ['required', 'string', 'regex:/^(\+?254|0)[17]\d{8}$/'],
            'amount' => ['required', 'integer', 'min:20', 'max:150000'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678).',
        ];
    }
}
