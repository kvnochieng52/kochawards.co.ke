<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\NomineeController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\Admin\AdminCampaignController;
use App\Http\Controllers\Api\Admin\AdminNomineeController;
use App\Http\Controllers\Api\Admin\AdminPaymentController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUploadController;
use Illuminate\Support\Facades\Route;

// -------------------- Public --------------------
Route::get('/health', fn () => ['status' => 'ok', 'name' => config('app.name')]);

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

// Public content
Route::get('/search', SearchController::class);
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign:slug}', [CampaignController::class, 'show']);
Route::get('/campaigns/{campaign:slug}/nominees', [CampaignController::class, 'nominees']);

Route::get('/nominees/trending', [NomineeController::class, 'trending']);
// Public detail — bind by slug (pretty URL). Accepts the numeric id too as a fallback.
Route::get('/nominees/{nominee:slug}', [NomineeController::class, 'show']);
Route::get('/nominees/id/{nominee}', [NomineeController::class, 'show']);

// Voting (public — no auth, guarded by M-Pesa)
Route::post('/votes/initiate', [VoteController::class, 'initiate']);
Route::post('/votes/callback', [VoteController::class, 'callback']);
Route::get('/votes/{vote}/status', [VoteController::class, 'status']);
Route::post('/votes/{vote}/simulate', [VoteController::class, 'simulateSuccess']);

// -------------------- Admin --------------------
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', AdminStatsController::class);

    Route::apiResource('campaigns', AdminCampaignController::class);
    Route::apiResource('nominees', AdminNomineeController::class);

    Route::get('/payments', [AdminPaymentController::class, 'index']);
    Route::post('/uploads', [AdminUploadController::class, 'store']);
});
