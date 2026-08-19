<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nominees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('full_name');
            $table->string('photo')->nullable();
            $table->string('cover_photo')->nullable();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('category')->nullable();
            $table->unsignedBigInteger('votes')->default(0);
            $table->boolean('verified')->default(false);
            $table->json('achievements')->nullable();
            $table->string('website')->nullable();
            $table->json('socials')->nullable();

            // Individual fields
            $table->string('role')->nullable();
            $table->string('organization')->nullable();
            $table->unsignedInteger('years_of_service')->nullable();
            $table->unsignedInteger('people_reached')->nullable();
            $table->unsignedInteger('age')->nullable();
            $table->json('languages')->nullable();

            // Organization fields
            $table->string('chairperson')->nullable();
            $table->unsignedInteger('member_count')->nullable();
            $table->unsignedSmallInteger('founded_year')->nullable();
            $table->unsignedBigInteger('amount_mobilized_kes')->nullable();
            $table->string('registration_no')->nullable();
            $table->string('meeting_cadence')->nullable();

            $table->json('programs')->nullable();
            $table->timestamps();

            $table->index(['campaign_id', 'votes']);
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nominees');
    }
};
