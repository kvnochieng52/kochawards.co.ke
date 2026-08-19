<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NomineeResource;
use App\Models\Nominee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NomineeController extends Controller
{
    /** GET /api/nominees/{id} */
    public function show(Nominee $nominee): JsonResponse
    {
        $nominee->load('campaign');
        return response()->json(['data' => new NomineeResource($nominee)]);
    }

    /** GET /api/nominees/trending?limit=6 */
    public function trending(Request $request): JsonResponse
    {
        $limit = min((int) $request->query('limit', 6), 24);

        $nominees = Nominee::query()
            ->with('campaign')
            ->whereHas('campaign', fn ($q) => $q->where('status', 'live'))
            ->orderByDesc('votes')
            ->limit($limit)
            ->get();

        return response()->json(['data' => NomineeResource::collection($nominees)]);
    }
}
