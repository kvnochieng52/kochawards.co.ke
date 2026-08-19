<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'image', 'max:5120'], // 5MB
            'kind' => ['sometimes', 'in:photo,cover,campaign'],
        ]);

        $folder = 'uploads/' . ($data['kind'] ?? 'photo');
        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs($folder, $filename, 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'path' => $path,
            'url' => $url,
        ], 201);
    }
}
