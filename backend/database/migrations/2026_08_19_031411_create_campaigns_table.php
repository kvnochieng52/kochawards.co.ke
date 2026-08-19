<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('featured_image')->nullable();
            $table->string('category');
            $table->string('organizer')->nullable();
            $table->string('location')->nullable();
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->unsignedInteger('vote_price_kes')->default(10);
            $table->enum('status', ['upcoming', 'live', 'ended'])->default('upcoming');
            $table->boolean('featured')->default(false);
            $table->text('prize')->nullable();
            $table->json('rules')->nullable();
            $table->json('sponsors')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
