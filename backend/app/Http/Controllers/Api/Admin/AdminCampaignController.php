<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCampaignRequest;
use App\Http\Requests\Admin\UpdateCampaignRequest;
use App\Http\Resources\CampaignResource;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminCampaignController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $campaigns = Campaign::query()
            ->withCount('nominees')
            ->withSum(
                ['votes as total_votes_agg' => fn ($q) => $q->where('status', 'success')],
                'vote_count'
            )
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => CampaignResource::collection($campaigns)]);
    }

    public function store(StoreCampaignRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Enforce single-featured invariant
        $campaign = DB::transaction(function () use ($data) {
            if (!empty($data['featured'])) {
                Campaign::where('featured', true)->update(['featured' => false]);
            }
            return Campaign::create($data);
        });

        $campaign->loadCount('nominees');

        return response()->json([
            'data' => new CampaignResource($campaign),
            'message' => 'Campaign created.',
        ], 201);
    }

    public function show(Campaign $campaign): JsonResponse
    {
        $campaign->loadCount('nominees');
        return response()->json(['data' => new CampaignResource($campaign)]);
    }

    public function update(UpdateCampaignRequest $request, Campaign $campaign): JsonResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($campaign, $data) {
            if (!empty($data['featured'])) {
                Campaign::where('featured', true)
                    ->where('id', '!=', $campaign->id)
                    ->update(['featured' => false]);
            }
            $campaign->update($data);
        });

        $campaign->loadCount('nominees');

        return response()->json([
            'data' => new CampaignResource($campaign),
            'message' => 'Campaign updated.',
        ]);
    }

    public function destroy(Campaign $campaign): JsonResponse
    {
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted.']);
    }
}
