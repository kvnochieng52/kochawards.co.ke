<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VoteResource;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = Vote::query()->with('nominee');

        if ($status = $request->query('status')) {
            $q->where('status', $status);
        }
        if ($cid = $request->query('campaign_id')) {
            $q->where('campaign_id', $cid);
        }

        $range = $request->query('range', 'today');
        match ($range) {
            'today' => $q->whereDate('created_at', now()->toDateString()),
            '7d' => $q->where('created_at', '>=', now()->subDays(7)),
            '30d' => $q->where('created_at', '>=', now()->subDays(30)),
            default => null,
        };

        $payments = $q->orderByDesc('created_at')->limit(200)->get();

        $summary = [
            'revenue' => (int) Vote::where('status', 'success')
                ->when($range === 'today', fn ($q) => $q->whereDate('created_at', now()->toDateString()))
                ->sum('amount_kes'),
            'success' => (int) Vote::where('status', 'success')->count(),
            'pending' => (int) Vote::where('status', 'pending')->count(),
            'failed' => (int) Vote::where('status', 'failed')->count(),
        ];

        return response()->json([
            'data' => VoteResource::collection($payments),
            'summary' => $summary,
        ]);
    }
}
