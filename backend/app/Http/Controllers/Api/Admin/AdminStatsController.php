<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\NomineeResource;
use App\Models\Campaign;
use App\Models\Nominee;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $totalVotes = (int) Vote::where('status', 'success')->sum('vote_count');
        $totalRevenue = (int) Vote::where('status', 'success')->sum('amount_kes');
        $pendingRevenue = (int) Vote::where('status', 'pending')->sum('amount_kes');
        $liveCampaigns = Campaign::where('status', 'live')->count();
        $totalCampaigns = Campaign::count();
        $totalNominees = Nominee::count();

        $topNominees = Nominee::query()
            ->with('campaign')
            ->orderByDesc('votes')
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_votes' => $totalVotes,
                'total_revenue' => $totalRevenue,
                'pending_revenue' => $pendingRevenue,
                'live_campaigns' => $liveCampaigns,
                'total_campaigns' => $totalCampaigns,
                'total_nominees' => $totalNominees,
            ],
            'top_nominees' => NomineeResource::collection($topNominees),
        ]);
    }
}
