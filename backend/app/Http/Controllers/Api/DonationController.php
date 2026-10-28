<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiateDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use App\Services\Exceptions\MpesaConfigurationException;
use App\Services\Exceptions\MpesaRequestException;
use App\Services\MpesaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DonationController extends Controller
{
    public function __construct(protected MpesaService $mpesa) {}

    /** POST /api/donations/initiate — kicks off M-Pesa STK Push for a donation */
    public function initiate(InitiateDonationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $program = $data['program'] ?? 'boma-bora';
        $amount = (int) $data['amount'];
        $phone = $this->mpesa->normalizePhone($data['phone']);

        $donation = Donation::create([
            'program' => $program,
            'donor_name' => $data['donor_name'] ?? null,
            'phone' => $phone,
            'amount_kes' => $amount,
            'status' => 'pending',
        ]);

        try {
            $response = $this->mpesa->stkPush(
                phone: $phone,
                amount: $amount,
                accountRef: strtoupper(str_replace('-', '', $program)),
                description: 'BOMA BORA Donation'
            );

            $donation->update([
                'mpesa_merchant_request_id' => $response['MerchantRequestID'] ?? null,
                'mpesa_checkout_request_id' => $response['CheckoutRequestID'] ?? null,
                'mpesa_response' => json_encode($response),
            ]);

            return response()->json([
                'data' => new DonationResource($donation),
                'message' => 'STK push sent to your phone. Enter your M-Pesa PIN to confirm your donation.',
            ], 201);
        } catch (MpesaConfigurationException $e) {
            if (app()->isProduction()) {
                Log::error('M-Pesa not configured in production', ['err' => $e->getMessage()]);
                $donation->update(['status' => 'failed', 'mpesa_response' => json_encode(['error' => $e->getMessage()])]);
                return response()->json([
                    'message' => 'Donation service is temporarily unavailable. Please try again shortly.',
                ], 503);
            }

            Log::warning('M-Pesa not configured — simulating donation STK', ['err' => $e->getMessage()]);
            $donation->update([
                'mpesa_checkout_request_id' => 'sim-donation-' . $donation->id,
                'mpesa_response' => json_encode(['simulated' => true, 'error' => $e->getMessage()]),
            ]);
            return response()->json([
                'data' => new DonationResource($donation),
                'message' => 'STK push simulated (M-Pesa credentials not configured). Poll /api/donations/{id}/status.',
            ], 201);
        } catch (MpesaRequestException $e) {
            Log::error('M-Pesa donation STK failed', [
                'err' => $e->getMessage(),
                'response' => $e->response,
                'donation_id' => $donation->id,
            ]);
            $donation->update([
                'status' => 'failed',
                'mpesa_response' => json_encode(['error' => $e->getMessage(), 'body' => $e->response]),
            ]);
            return response()->json([
                'message' => $e->getMessage(),
            ], 502);
        }
    }

    /** GET /api/donations/{donation}/status — poll for completion */
    public function status(Donation $donation): JsonResponse
    {
        return response()->json(['data' => new DonationResource($donation)]);
    }

    /** POST /api/donations/callback — M-Pesa Daraja callback */
    public function callback(Request $request): JsonResponse
    {
        $payload = $request->json('Body.stkCallback', []);
        $checkoutRequestId = $payload['CheckoutRequestID'] ?? null;
        $resultCode = (int) ($payload['ResultCode'] ?? -1);

        Log::info('M-Pesa donation callback', $payload);

        if (!$checkoutRequestId) {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Ignored — no CheckoutRequestID']);
        }

        $donation = Donation::where('mpesa_checkout_request_id', $checkoutRequestId)->first();
        if (!$donation) {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Donation not found — ignored']);
        }

        if ($donation->status === 'success') {
            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Already processed']);
        }

        if ($resultCode === 0) {
            $meta = collect($payload['CallbackMetadata']['Item'] ?? [])->keyBy('Name');
            $receipt = $meta['MpesaReceiptNumber']['Value'] ?? null;
            $paidAt = $meta['TransactionDate']['Value'] ?? null;

            $donation->update([
                'status' => 'success',
                'mpesa_receipt' => $receipt,
                'paid_at' => $paidAt
                    ? \Illuminate\Support\Carbon::createFromFormat('YmdHis', (string) $paidAt)
                    : now(),
                'mpesa_response' => json_encode($payload),
            ]);
        } else {
            $donation->update([
                'status' => $resultCode === 1032 ? 'cancelled' : 'failed',
                'mpesa_response' => json_encode($payload),
            ]);
        }

        return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    }
}
