<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Nominee;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /** GET /api/search?q=...  — lightweight autocomplete over campaigns + nominees */
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));
        $limit = min((int) $request->query('limit', 6), 15);

        if (mb_strlen($query) < 2) {
            return response()->json([
                'query' => $query,
                'campaigns' => [],
                'nominees' => [],
            ]);
        }

        $like = '%' . str_replace(['%', '_'], ['\%', '\_'], $query) . '%';

        $campaigns = Campaign::query()
            ->where(function ($q) use ($like) {
                $q->where('title', 'like', $like)
                    ->orWhere('tagline', 'like', $like)
                    ->orWhere('category', 'like', $like)
                    ->orWhere('location', 'like', $like);
            })
            ->orderByRaw("FIELD(status, 'live', 'upcoming', 'ended')")
            ->orderByDesc('featured')
            ->limit($limit)
            ->get(['id', 'slug', 'title', 'tagline', 'category', 'location', 'status', 'featured_image']);

        $nominees = Nominee::query()
            ->with(['campaign:id,slug,title,status'])
            ->where(function ($q) use ($like) {
                $q->where('full_name', 'like', $like)
                    ->orWhere('code', 'like', $like)
                    ->orWhere('category', 'like', $like)
                    ->orWhere('location', 'like', $like)
                    ->orWhere('organization', 'like', $like);
            })
            ->orderByDesc('votes')
            ->limit($limit)
            ->get(['id', 'slug', 'campaign_id', 'code', 'full_name', 'photo', 'category', 'location', 'votes']);

        return response()->json([
            'query' => $query,
            'campaigns' => $campaigns->map(fn ($c) => [
                'id' => (string) $c->id,
                'slug' => $c->slug,
                'title' => $c->title,
                'tagline' => $c->tagline,
                'category' => $c->category,
                'location' => $c->location,
                'status' => $c->status,
                'featuredImage' => $c->featured_image,
            ])->values(),
            'nominees' => $nominees->map(fn ($n) => [
                'id' => (string) $n->id,
                'slug' => $n->slug,
                'code' => $n->code,
                'fullName' => $n->full_name,
                'photo' => $n->photo,
                'category' => $n->category,
                'location' => $n->location,
                'votes' => (int) $n->votes,
                'campaign' => $n->campaign ? [
                    'id' => (string) $n->campaign->id,
                    'slug' => $n->campaign->slug,
                    'title' => $n->campaign->title,
                    'status' => $n->campaign->status,
                ] : null,
            ])->values(),
        ]);
    }
}
