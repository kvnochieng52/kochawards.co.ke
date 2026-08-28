<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VoteResource;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminPaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = $this->filteredQuery($request);

        $perPage = (int) $request->query('per_page', 20);
        $perPage = max(1, min($perPage, 100));

        $payments = $q->orderByDesc('created_at')->paginate($perPage)->withQueryString();

        $range = $request->query('range', 'today');
        $summary = [
            'revenue' => (int) Vote::where('status', 'success')
                ->when($range === 'today', fn ($q) => $q->whereDate('created_at', now()->toDateString()))
                ->sum('amount_kes'),
            'success' => (int) Vote::where('status', 'success')->count(),
            'pending' => (int) Vote::where('status', 'pending')->count(),
            'failed' => (int) Vote::where('status', 'failed')->count(),
        ];

        $total = $payments->total();
        $message = $total === 0
            ? 'No payments found.'
            : sprintf(
                'Showing %d–%d of %d payment%s.',
                $payments->firstItem(),
                $payments->lastItem(),
                $total,
                $total === 1 ? '' : 's'
            );

        return response()->json([
            'message' => $message,
            'data' => VoteResource::collection($payments->items()),
            'summary' => $summary,
            'meta' => [
                'currentPage' => $payments->currentPage(),
                'lastPage' => $payments->lastPage(),
                'perPage' => $payments->perPage(),
                'total' => $total,
                'from' => $payments->firstItem(),
                'to' => $payments->lastItem(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $q = $this->filteredQuery($request)->orderByDesc('created_at');

        $filename = 'payments-' . now()->format('Ymd-His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-store',
        ];

        return response()->stream(function () use ($q) {
            $out = fopen('php://output', 'w');
            // UTF-8 BOM so Excel opens Kenyan currency / accented names correctly
            fwrite($out, "\xEF\xBB\xBF");

            fputcsv($out, [
                'Timestamp',
                'M-Pesa Receipt',
                'M-Pesa Checkout ID',
                'Phone',
                'Nominee',
                'Nominee Code',
                'Amount (KES)',
                'Votes',
                'Status',
                'Paid At',
            ]);

            $q->with('nominee')->chunk(500, function ($rows) use ($out) {
                foreach ($rows as $v) {
                    fputcsv($out, [
                        optional($v->created_at)?->toIso8601String(),
                        $v->mpesa_receipt,
                        $v->mpesa_checkout_request_id,
                        $v->phone,
                        $v->nominee?->full_name,
                        $v->nominee?->code,
                        (int) $v->amount_kes,
                        (int) $v->vote_count,
                        $v->status,
                        optional($v->paid_at)?->toIso8601String(),
                    ]);
                }
            });

            fclose($out);
        }, 200, $headers);
    }

    private function filteredQuery(Request $request)
    {
        $q = Vote::query();

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

        if ($search = trim((string) $request->query('search', ''))) {
            $q->where(function ($w) use ($search) {
                $w->where('mpesa_receipt', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('mpesa_checkout_request_id', 'like', "%{$search}%")
                    ->orWhereHas('nominee', function ($n) use ($search) {
                        $n->where('full_name', 'like', "%{$search}%")
                            ->orWhere('code', 'like', "%{$search}%");
                    });
            });
        }

        return $q;
    }
}
