<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'tagline',
        'description',
        'featured_image',
        'category',
        'organizer',
        'location',
        'start_date',
        'end_date',
        'vote_price_kes',
        'status',
        'featured',
        'prize',
        'rules',
        'sponsors',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'vote_price_kes' => 'integer',
            'featured' => 'boolean',
            'rules' => 'array',
            'sponsors' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Campaign $c) {
            if (empty($c->slug)) {
                $c->slug = Str::slug($c->title);
            }
        });
    }

    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** Successful vote total across all nominees in this campaign */
    public function totalVotes(): int
    {
        return (int) $this->votes()->where('status', 'success')->sum('vote_count');
    }
}
