<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /** POST /api/contact — record an inbound contact message */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:180'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject' => ['nullable', 'string', 'max:200'],
            'message' => ['required', 'string', 'min:5', 'max:5000'],
            'source' => ['nullable', 'string', 'max:60'],
        ]);

        $data['source'] = $data['source'] ?? 'boma-bora';

        $msg = ContactMessage::create($data);

        return response()->json([
            'message' => 'Thank you. We have received your message and will respond shortly.',
            'data' => ['id' => (string) $msg->id],
        ], 201);
    }
}
