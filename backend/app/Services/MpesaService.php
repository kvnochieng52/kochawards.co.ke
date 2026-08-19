<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

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
                throw new RuntimeException('M-Pesa consumer key/secret missing (set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET).');
            }

            $res = Http::withBasicAuth($key, $secret)->get($this->urls['oauth']);
            if (!$res->ok() || !$res->json('access_token')) {
                Log::error('M-Pesa oauth failed', ['body' => $res->body()]);
                throw new RuntimeException('Failed to obtain M-Pesa access token.');
            }
            return $res->json('access_token');
        });
    }

    /** Trigger Lipa Na M-Pesa Online (STK Push) */
    public function stkPush(string $phone, int $amount, string $accountRef, string $description = 'Kura vote'): array
    {
        $shortcode = config('mpesa.shortcode');
        $passkey = config('mpesa.passkey');
        $callback = config('mpesa.callback_url');

        if (!$shortcode || !$passkey || !$callback) {
            throw new RuntimeException('M-Pesa shortcode/passkey/callback_url not configured.');
        }

        $timestamp = now()->format('YmdHis');
        $password = base64_encode($shortcode . $passkey . $timestamp);
        $msisdn = $this->normalizePhone($phone);

        $payload = [
            'BusinessShortCode' => $shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => $amount,
            'PartyA' => $msisdn,
            'PartyB' => $shortcode,
            'PhoneNumber' => $msisdn,
            'CallBackURL' => $callback,
            'AccountReference' => substr($accountRef, 0, 12),
            'TransactionDesc' => substr($description, 0, 13),
        ];

        $res = Http::withToken($this->accessToken())
            ->acceptJson()
            ->post($this->urls['stk'], $payload);

        $body = $res->json() ?? [];

        if (!$res->successful() || ($body['ResponseCode'] ?? '1') !== '0') {
            Log::warning('M-Pesa STK push non-success', ['status' => $res->status(), 'body' => $body]);
        }

        return $body;
    }

    /** Convert 07XX or +2547XX to 2547XX (safaricom format) */
    public function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);
        if (str_starts_with($digits, '0')) {
            $digits = '254' . substr($digits, 1);
        } elseif (str_starts_with($digits, '+')) {
            $digits = ltrim($digits, '+');
        } elseif (!str_starts_with($digits, '254')) {
            $digits = '254' . $digits;
        }
        return $digits;
    }
}
