<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add nullable slug column
        Schema::table('nominees', function (Blueprint $table) {
            $table->string('slug', 191)->nullable()->after('code');
        });

        // 2. Backfill slugs for every existing nominee, deduping by full_name
        $rows = DB::table('nominees')->whereNull('slug')->orderBy('id')->get(['id', 'full_name']);
        $seen = [];
        foreach ($rows as $row) {
            $base = Str::slug($row->full_name);
            if ($base === '') {
                $base = 'nominee-' . $row->id;
            }
            $slug = $base;
            $i = 2;
            while (
                in_array($slug, $seen, true) ||
                DB::table('nominees')->where('slug', $slug)->exists()
            ) {
                $slug = $base . '-' . $i++;
            }
            DB::table('nominees')->where('id', $row->id)->update(['slug' => $slug]);
            $seen[] = $slug;
        }

        // 3. Add unique index
        Schema::table('nominees', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    public function down(): void
    {
        Schema::table('nominees', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
