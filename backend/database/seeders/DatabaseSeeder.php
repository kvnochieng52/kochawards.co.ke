<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Default seeder — production-safe.
 *
 * Only seeds the admin user (from ADMIN_EMAIL / ADMIN_PASSWORD in .env).
 * Sample data seeders (CampaignSeeder, NomineeSeeder) are NOT called here
 * so they don't run in production. They still exist as reference examples
 * and can be run manually for local development:
 *
 *     php artisan db:seed --class=CampaignSeeder
 *     php artisan db:seed --class=NomineeSeeder
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
        ]);
    }
}
