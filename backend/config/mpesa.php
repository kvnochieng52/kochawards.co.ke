<?php

return [
    'env' => env('MPESA_ENV', 'sandbox'),

    'consumer_key' => env('MPESA_CONSUMER_KEY'),
    'consumer_secret' => env('MPESA_CONSUMER_SECRET'),
    'shortcode' => env('MPESA_SHORTCODE', '174379'),
    'passkey' => env('MPESA_PASSKEY'),
    'callback_url' => env('MPESA_CALLBACK_URL'),
    'account_ref' => env('MPESA_ACCOUNT_REF', 'KochAwards'),

    'urls' => [
        'sandbox' => [
            'oauth' => 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            'stk' => 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        ],
        'production' => [
            'oauth' => 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            'stk' => 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        ],
    ],
];
