<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class MakeAdminCommand extends Command
{
    /**
     * Usage:
     *   php artisan admin:make admin@example.com "StrongP@ss1" --name="Super Admin"
     *   php artisan admin:make   (interactive)
     */
    protected $signature = 'admin:make
                            {email? : Admin email address}
                            {password? : Plain-text password (min 8 chars)}
                            {--name= : Display name (default: "Admin")}';

    protected $description = 'Create or update an admin user (idempotent by email).';

    public function handle(): int
    {
        $email = $this->argument('email') ?: $this->ask('Admin email');
        $password = $this->argument('password') ?: $this->secret('Password (min 8 chars)');
        $name = $this->option('name') ?: ($this->ask('Display name', 'Admin'));

        $validator = Validator::make(
            ['email' => $email, 'password' => $password, 'name' => $name],
            [
                'email' => ['required', 'email'],
                'password' => ['required', 'string', 'min:8'],
                'name' => ['required', 'string', 'max:100'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $err) {
                $this->error($err);
            }
            return self::FAILURE;
        }

        $existing = User::where('email', $email)->first();

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $verb = $existing ? 'updated' : 'created';
        $this->info("Admin {$verb}: #{$user->id} · {$user->name} <{$user->email}> (is_admin=true)");
        return self::SUCCESS;
    }
}
