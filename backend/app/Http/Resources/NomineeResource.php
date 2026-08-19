<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NomineeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'campaignId' => (string) $this->campaign_id,
            'campaign' => $this->whenLoaded('campaign', fn () => [
                'id' => (string) $this->campaign->id,
                'slug' => $this->campaign->slug,
                'title' => $this->campaign->title,
                'status' => $this->campaign->status,
            ]),
            'code' => $this->code,
            'fullName' => $this->full_name,
            'photo' => $this->photo,
            'coverPhoto' => $this->cover_photo,
            'headline' => $this->headline,
            'bio' => $this->bio,
            'location' => $this->location,
            'category' => $this->category,
            'votes' => (int) $this->votes,
            'verified' => (bool) $this->verified,
            'achievements' => $this->achievements ?? [],
            'website' => $this->website,
            'socials' => $this->socials ?? new \stdClass(),

            'role' => $this->role,
            'organization' => $this->organization,
            'yearsOfService' => $this->years_of_service,
            'peopleReached' => $this->people_reached,
            'age' => $this->age,
            'languages' => $this->languages ?? [],

            'chairperson' => $this->chairperson,
            'memberCount' => $this->member_count,
            'foundedYear' => $this->founded_year,
            'amountMobilizedKes' => $this->amount_mobilized_kes,
            'registrationNo' => $this->registration_no,
            'meetingCadence' => $this->meeting_cadence,

            'programs' => $this->programs ?? [],
        ];
    }
}
