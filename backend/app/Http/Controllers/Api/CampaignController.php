<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CampaignResource;
use App\Http\Resources\NomineeResource;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /** GET /api/campaigns */
    public function index(Request $request): JsonResponse
    {
        $q = Campaign::query()
            ->withCount('nominees')
            ->withSum(
                ['votes as total_votes_agg' => fn ($q) => $q->where('status', 'success')],
                'vote_count'
            );

        if ($status = $request->query('status')) {
            $q->where('status', $status);
        }
        if ($category = $request->query('category')) {
            $q->where('category', $category);
        }

        $campaigns = $q->orderByDesc('featured')
            ->orderByRaw("FIELD(status, 'live', 'upcoming', 'ended')")
            ->orderByDesc('end_date')
            ->get();

        return response()->json([
            'data' => CampaignResource::collection($campaigns),
        ]);
    }

    /** GET /api/campaigns/{slug} */
    public function show(Campaign $campaign): JsonResponse
    {
        $campaign->loadCount('nominees');
        $campaign->setAttribute(
            'total_votes_agg',
            (int) $campaign->votes()->where('status', 'success')->sum('vote_count')
        );
        return response()->json(['data' => new CampaignResource($campaign)]);
    }

    /** GET /api/campaigns/{slug}/nominees */
    public function nominees(Campaign $campaign): JsonResponse
    {
        $nominees = $campaign->nominees()->orderByDesc('votes')->get();
        return response()->json(['data' => NomineeResource::collection($nominees)]);
    }
}
