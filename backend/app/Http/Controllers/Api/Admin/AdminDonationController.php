<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDonationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = $this->filteredQuery($request);

        $perPage = (int) $request->query('per_page', 20);
        $perPage = max(1, min($perPage, 100));

        $donations = $q->orderByDesc('created_at')->paginate($perPage)->withQueryString();

        $range = $request->query('range', 'today');
        $summary = [
            'raised' => (int) Donation::where('status', 'success')
                ->when($range === 'today', fn ($q) => $q->whereDate('created_at', now()->toDateString()))
                ->sum('amount_kes'),
            'success' => (int) Donation::where('status', 'success')->count(),
            'pending' => (int) Donation::where('status', 'pending')->count(),
            'failed' => (int) Donation::where('status', 'failed')->count(),
            'donors' => (int) Donation::where('status', 'success')->distinct('phone')->count('phone'),
        ];

        $total = $donations->total();
        $message = $total === 0
            ? 'No donations found.'
            : sprintf(
                'Showing %d–%d of %d donation%s.',
                $donations->firstItem(),
                $donations->lastItem(),
                $total,
                $total === 1 ? '' : 's'
            );

        return response()->json([
            'message' => $message,
            'data' => DonationResource::collection($donations->items()),
            'summary' => $summary,
            'meta' => [
                'currentPage' => $donations->currentPage(),
                'lastPage' => $donations->lastPage(),
                'perPage' => $donations->perPage(),
                'total' => $total,
                'from' => $donations->firstItem(),
                'to' => $donations->lastItem(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $q = $this->filteredQuery($request)->orderByDesc('created_at');

        $filename = 'donations-' . now()->format('Ymd-His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Cache-Control' => 'no-store',
        ];

        return response()->stream(function () use ($q) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");

            fputcsv($out, [
                'Timestamp',
                'Programme',
                'Donor name',
                'Phone',
                'Amount (KES)',
                'Status',
                'M-Pesa Receipt',
                'M-Pesa Checkout ID',
                'Paid At',
            ]);

            $q->chunk(500, function ($rows) use ($out) {
                foreach ($rows as $d) {
                    fputcsv($out, [
                        optional($d->created_at)?->toIso8601String(),
                        $d->program,
                        $d->donor_name,
                        $d->phone,
                        (int) $d->amount_kes,
                        $d->status,
                        $d->mpesa_receipt,
                        $d->mpesa_checkout_request_id,
                        optional($d->paid_at)?->toIso8601String(),
                    ]);
                }
            });

            fclose($out);
        }, 200, $headers);
    }

    private function filteredQuery(Request $request)
    {
        $q = Donation::query();

        if ($status = $request->query('status')) {
            $q->where('status', $status);
        }
        if ($program = $request->query('program')) {
            $q->where('program', $program);
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
                    ->orWhere('donor_name', 'like', "%{$search}%")
                    ->orWhere('mpesa_checkout_request_id', 'like', "%{$search}%");
            });
        }

        return $q;
    }
}
