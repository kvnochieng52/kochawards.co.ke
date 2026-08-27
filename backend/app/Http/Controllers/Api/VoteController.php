<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiateVoteRequest;
use App\Http\Resources\VoteResource;
use App\Models\Nominee;
use App\Models\Vote;
use App\Services\Exceptions\MpesaConfigurationException;
use App\Services\Exceptions\MpesaRequestException;
use App\Services\MpesaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    public function __construct(protected MpesaService $mpesa) {}

    /** POST /api/votes/initiate — kicks off M-Pesa STK Push */
    public function initiate(InitiateVoteRequest $request): JsonResponse
    {
        $data = $request->validated();
        $nominee = Nominee::with('campaign')->findOrFail($data['nominee_id']);
        $campaign = $nominee->campaign;

        abort_if($campaign->status !== 'live', 422, 'This campaign is not currently accepting votes.');

        $amount = (int) $data['amount'];
        $voteCount = max(1, intdiv($amount, $campaign->vote_price_kes));
        $phone = $this->mpesa->normalizePhone($data['phone']);

        // Create pending vote first so we can correlate the callback
        $vote = Vote::create([
            'nominee_id' => $nominee->id,
            'campaign_id' => $campaign->id,
            'phone' => $phone,
            'amount_kes' => $amount,
            'vote_count' => $voteCount,
            'status' => 'pending',
        ]);

        try {
            $response = $this->mpesa->stkPush(
                phone: $phone,
                amount: $amount,
                accountRef: config('mpesa.account_ref', 'KochAwards') . $nominee->code,
                description: 'Koch Award Vote'
            );

            $vote->update([
                'mpesa_merchant_request_id' => $response['MerchantRequestID'] ?? null,
                'mpesa_checkout_request_id' => $response['CheckoutRequestID'] ?? null,
                'mpesa_response' => json_encode($response),
            ]);

            return response()->json([
                'data' => new VoteResource($vote),
                'message' => 'STK push sent to your phone. Enter your M-Pesa PIN to confirm.',
            ], 201);
        } catch (MpesaConfigurationException $e) {
            // Only auto-simulate outside production so devs can work without Daraja creds.
            if (app()->isProduction()) {
                Log::error('M-Pesa not configured in production', ['err' => $e->getMessage()]);
                $vote->update(['status' => 'failed', 'mpesa_response' => json_encode(['error' => $e->getMessage()])]);
                return response()->json([
                    'message' => 'Payment service is temporarily unavailable. Please try again shortly.',
                ], 503);
            }

            Log::warning('M-Pesa not configured — simulating STK', ['err' => $e->getMessage()]);
            $vote->update([
                'mpesa_checkout_request_id' => 'sim-' . $vote->id,
                'mpesa_response' => json_encode(['simulated' => true, 'error' => $e->getMessage()]),
            ]);
            return response()->json([
                'data' => new VoteResource($vote),
                'message' => 'STK push simulated (M-Pesa credentials not configured). Poll /api/votes/{id}/status.',
            ], 201);
        } catch (MpesaRequestException $e) {
            Log::error('M-Pesa STK push failed', [
                'err' => $e->getMessage(),
                'response' => $e->response,
                'vote_id' => $vote->id,
            ]);
            $vote->update([
                'status' => 'failed',
                'mpesa_response' => json_encode(['error' => $e->getMessage(), 'body' => $e->response]),
            ]);
            return response()->json([
                'message' => $e->getMessage(),
            ], 502);
        }
    }

    /** GET /api/votes/{vote}/status — poll for completion (used by the vote modal) */
    public function status(Vote $vote): JsonResponse
    {
        return response()->json(['data' => new VoteResource($vote)]);
    }

    /** POST /api/votes/callback — M-Pesa Daraja callback */
    public function callback(Request $request): JsonResponse
    {
        $payload = $request->json('Body.stkCallback', []);
        $checkoutRequestId = $payload['CheckoutRequestID'] ?? null;
        $resultCode = (int) ($payload['ResultCode'] ?? -1);

        Log::info('M-Pesa callback', $payload);

        if (!$checkoutRequestId) {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Ignored — no CheckoutRequestID']);
        }

        $vote = Vote::where('mpesa_checkout_request_id', $checkoutRequestId)->first();
        if (!$vote) {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Vote not found — ignored']);
        }

        // Idempotency: once we've already recorded success, don't double-count.
        if ($vote->status === 'success') {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Already processed']);
        }

        if ($resultCode === 0) {
            $meta = collect($payload['CallbackMetadata']['Item'] ?? [])->keyBy('Name');
            $receipt = $meta['MpesaReceiptNumber']['Value'] ?? null;
            $paidAt = $meta['TransactionDate']['Value'] ?? null;

            DB::transaction(function () use ($vote, $receipt, $paidAt, $payload) {
                $vote->update([
                    'status' => 'success',
                    'mpesa_receipt' => $receipt,
                    'paid_at' => $paidAt
                        ? \Illuminate\Support\Carbon::createFromFormat('YmdHis', (string) $paidAt)
                        : now(),
                    'mpesa_response' => json_encode($payload),
                ]);
                $vote->nominee()->increment('votes', $vote->vote_count);
            });
        } else {
            $vote->update([
                'status' => $resultCode === 1032 ? 'cancelled' : 'failed',
                'mpesa_response' => json_encode($payload),
            ]);
        }

        return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    }

    /** POST /api/votes/{vote}/simulate — dev-only: mark a simulated vote as success */
    public function simulateSuccess(Vote $vote): JsonResponse
    {
        abort_if(app()->isProduction(), 404);

        DB::transaction(function () use ($vote) {
            $vote->update([
                'status' => 'success',
                'mpesa_receipt' => 'SIM' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8)),
                'paid_at' => now(),
            ]);
            $vote->nominee()->increment('votes', $vote->vote_count);
        });

        return response()->json(['data' => new VoteResource($vote->fresh())]);
    }
}
