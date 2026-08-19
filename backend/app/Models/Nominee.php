<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nominee extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'code',
        'full_name',
        'photo',
        'cover_photo',
        'headline',
        'bio',
        'location',
        'category',
        'votes',
        'verified',
        'achievements',
        'website',
        'socials',
        'role',
        'organization',
        'years_of_service',
        'people_reached',
        'age',
        'languages',
        'chairperson',
        'member_count',
        'founded_year',
        'amount_mobilized_kes',
        'registration_no',
        'meeting_cadence',
        'programs',
    ];

    protected function casts(): array
    {
        return [
            'verified' => 'boolean',
            'achievements' => 'array',
            'socials' => 'array',
            'languages' => 'array',
            'programs' => 'array',
            'votes' => 'integer',
            'years_of_service' => 'integer',
            'people_reached' => 'integer',
            'age' => 'integer',
            'member_count' => 'integer',
            'founded_year' => 'integer',
            'amount_mobilized_kes' => 'integer',
        ];
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function votesLog(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function incrementVotes(int $by): void
    {
        $this->increment('votes', $by);
    }
}
