<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNomineeRequest;
use App\Http\Requests\Admin\UpdateNomineeRequest;
use App\Http\Resources\NomineeResource;
use App\Models\Nominee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNomineeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = Nominee::query()->with('campaign');

        if ($cid = $request->query('campaign_id')) {
            $q->where('campaign_id', $cid);
        }
        if ($search = $request->query('search')) {
            $q->where(function ($qq) use ($search) {
                $qq->where('full_name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $nominees = $q->orderByDesc('votes')->orderBy('full_name')->get();

        return response()->json(['data' => NomineeResource::collection($nominees)]);
    }

    public function store(StoreNomineeRequest $request): JsonResponse
    {
        $nominee = Nominee::create($request->validated());
        $nominee->load('campaign');

        return response()->json([
            'data' => new NomineeResource($nominee),
            'message' => 'Nominee added.',
        ], 201);
    }

    public function show(Nominee $nominee): JsonResponse
    {
        $nominee->load('campaign');
        return response()->json(['data' => new NomineeResource($nominee)]);
    }

    public function update(UpdateNomineeRequest $request, Nominee $nominee): JsonResponse
    {
        $nominee->update($request->validated());
        $nominee->load('campaign');

        return response()->json([
            'data' => new NomineeResource($nominee),
            'message' => 'Nominee updated.',
        ]);
    }

    public function destroy(Nominee $nominee): JsonResponse
    {
        $nominee->delete();
        return response()->json(['message' => 'Nominee deleted.']);
    }
}
