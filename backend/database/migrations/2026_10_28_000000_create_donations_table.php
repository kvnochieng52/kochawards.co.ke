<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->string('program', 64)->default('boma-bora');
            $table->string('donor_name')->nullable();
            $table->string('phone', 20);
            $table->unsignedInteger('amount_kes');
            $table->enum('status', ['pending', 'success', 'failed', 'cancelled'])->default('pending');
            $table->string('mpesa_merchant_request_id')->nullable();
            $table->string('mpesa_checkout_request_id')->nullable()->unique();
            $table->string('mpesa_receipt')->nullable();
            $table->text('mpesa_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['program', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
