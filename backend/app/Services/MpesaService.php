<?php

namespace App\Services;

use App\Services\Exceptions\MpesaConfigurationException;
use App\Services\Exceptions\MpesaRequestException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    protected string $env;
    protected array $urls;

    public function __construct()
    {
        $this->env = config('mpesa.env', 'sandbox');
        $this->urls = config('mpesa.urls')[$this->env] ?? config('mpesa.urls.sandbox');
    }

    /** OAuth access token (cached ~55 min) */
    public function accessToken(): string
    {
        return Cache::remember('mpesa:access_token:' . $this->env, 3300, function () {
            $key = config('mpesa.consumer_key');
            $secret = config('mpesa.consumer_secret');

            if (!$key || !$secret) {
                throw new MpesaConfigurationException('M-Pesa consumer key/secret missing (set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET).');
            }

            try {
                $res = Http::withBasicAuth($key, $secret)
                    ->timeout(15)
                    ->get($this->urls['oauth']);
            } catch (ConnectionException $e) {
                throw new MpesaRequestException('Could not reach M-Pesa OAuth endpoint: ' . $e->getMessage(), previous: $e);
            }

            $token = $res->json('access_token');
            if (!$res->ok() || !$token) {
                Log::error('M-Pesa oauth failed', ['status' => $res->status(), 'body' => $res->body()]);
                throw new MpesaRequestException(
                    'Failed to obtain M-Pesa access token.',
                    $res->json() ?? [],
                    $res->status(),
                );
            }

            return $token;
        });
    }

    /** Trigger Lipa Na M-Pesa Online (STK Push). Throws on config/request failure. */
    public function stkPush(string $phone, int $amount, string $accountRef, string $description = 'Koch Award Vote'): array
    {
        $shortcode = config('mpesa.shortcode');
        $passkey = config('mpesa.passkey');
        $callback = config('mpesa.callback_url');
        $txnType = config('mpesa.transaction_type', 'CustomerPayBillOnline');

        if (!$shortcode || !$passkey || !$callback) {
            throw new MpesaConfigurationException('M-Pesa shortcode/passkey/callback_url not configured.');
        }

        $timestamp = now()->format('YmdHis');
        $password = base64_encode($shortcode . $passkey . $timestamp);
        $msisdn = $this->normalizePhone($phone);

        $payload = [
            'BusinessShortCode' => $shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => $txnType,
            'Amount' => $amount,
            'PartyA' => $msisdn,
            'PartyB' => $shortcode,
            'PhoneNumber' => $msisdn,
            'CallBackURL' => $callback,
            'AccountReference' => substr($accountRef, 0, 12),
            'TransactionDesc' => substr($description, 0, 13),
        ];

        try {
            $res = Http::withToken($this->accessToken())
                ->acceptJson()
                ->timeout(20)
                ->post($this->urls['stk'], $payload);
        } catch (ConnectionException $e) {
            throw new MpesaRequestException('Could not reach M-Pesa STK endpoint: ' . $e->getMessage(), previous: $e);
        }

        $body = $res->json() ?? [];
        $responseCode = $body['ResponseCode'] ?? null;

        if (!$res->successful() || $responseCode !== '0') {
            $description = $body['errorMessage']
                ?? $body['ResponseDescription']
                ?? $body['CustomerMessage']
                ?? 'M-Pesa STK push was rejected.';
            Log::warning('M-Pesa STK push non-success', [
                'status' => $res->status(),
                'body' => $body,
                'phone' => $msisdn,
                'amount' => $amount,
            ]);
            throw new MpesaRequestException($description, $body, $res->status());
        }

        return $body;
    }

    /** Convert 07XX or +2547XX to 2547XX (safaricom format) */
    public function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);
        if (str_starts_with($digits, '0')) {
            $digits = '254' . substr($digits, 1);
        } elseif (!str_starts_with($digits, '254')) {
            $digits = '254' . $digits;
        }
        return $digits;
    }
}
