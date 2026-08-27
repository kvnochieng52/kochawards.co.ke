<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [
                'slug' => 'best-community-worker-2026',
                'title' => 'Best Community Worker 2026',
                'tagline' => 'Kenya’s unsung heroes, celebrated by the people they serve.',
                'description' => 'From maternal clinics in Kibera to boreholes in Turkana, community workers keep Kenya standing. This year we’re handing the mic to the country — vote for the individual whose service moved you the most. 100% of the winner’s prize funds their next project.',
                'featured_image' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80',
                'category' => 'Community',
                'organizer' => 'Ministry of Public Service & Koch Awards Foundation',
                'location' => 'Nationwide',
                'start_date' => '2026-07-01 00:00:00',
                'end_date' => '2026-09-30 23:59:00',
                'vote_price_kes' => 10,
                'status' => 'live',
                'featured' => true,
                'prize' => 'KES 500,000 personal grant + KES 500,000 project fund + primetime feature on Citizen TV',
                'rules' => [
                    'One vote costs KES 10 via M-Pesa.',
                    'You can vote as many times as you like for as many nominees as you like.',
                    'All nominees have been vetted by the National Council of NGOs.',
                    'The top three advance to the Nairobi finale on 10 October 2026.',
                    '100% of the winner’s project fund is disbursed via KCB Foundation.',
                ],
                'sponsors' => ['Safaricom Foundation', 'M-Pesa Foundation', 'KCB Foundation', 'Amref Health Africa', 'UN Women Kenya'],
            ],
            [
                'slug' => 'best-saving-organization-2026',
                'title' => 'Best Saving Organization 2026',
                'tagline' => 'Ranking Kenya’s most impactful chamas, SACCOs and savings groups.',
                'description' => 'Chamas, SACCOs and table-banking circles quietly move billions of shillings across Kenya every year. They fund homes, businesses, weddings and school fees when banks won’t. This campaign celebrates the savings organizations turning trust into capital.',
                'featured_image' => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
                'category' => 'Savings',
                'organizer' => 'Kenya Association of Investment Groups (KAIG)',
                'location' => 'Nationwide',
                'start_date' => '2026-07-15 00:00:00',
                'end_date' => '2026-09-15 23:59:00',
                'vote_price_kes' => 10,
                'status' => 'live',
                'featured' => false,
                'prize' => 'KES 2,000,000 institutional grant + free 12-month governance audit + M-Pesa integration credits',
                'rules' => [
                    'One vote costs KES 10 via M-Pesa.',
                    'Organizations must be registered with SASRA, KAIG or the Social Development Office.',
                    'Membership size is not a tie-breaker — impact per member matters.',
                    'Independent panel verifies the top 3 finalists before the finale.',
                ],
                'sponsors' => ['KCB Foundation', 'Co-op Bank', 'SASRA', 'Safaricom for Business'],
            ],
            [
                'slug' => 'teacher-of-the-decade-2025',
                'title' => 'Teacher of the Decade 2025',
                'tagline' => 'Because they shaped who we became.',
                'description' => 'A once-in-a-generation tribute to the educators who changed lives across Kenya over the last ten years.',
                'featured_image' => 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
                'category' => 'Education',
                'organizer' => 'Kenya Teachers’ Trust',
                'location' => 'Nationwide',
                'start_date' => '2025-05-01 00:00:00',
                'end_date' => '2025-07-20 20:00:00',
                'vote_price_kes' => 10,
                'status' => 'ended',
                'featured' => false,
                'prize' => 'KES 1,000,000 + fully-funded Masters programme',
                'rules' => null,
                'sponsors' => null,
            ],
            [
                'slug' => 'community-health-heroes-2025',
                'title' => 'Community Health Heroes 2025',
                'tagline' => 'Walking the last mile of primary healthcare.',
                'description' => 'The volunteer health workers keeping communities well between hospital visits, from Turkana to Kwale.',
                'featured_image' => 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1600&q=80',
                'category' => 'Health',
                'organizer' => 'Amref Health Africa',
                'location' => 'Nationwide',
                'start_date' => '2025-04-01 00:00:00',
                'end_date' => '2025-06-30 20:00:00',
                'vote_price_kes' => 10,
                'status' => 'ended',
                'featured' => false,
                'prize' => 'KES 800,000 grant + medical supplies from AAR Healthcare',
                'rules' => null,
                'sponsors' => null,
            ],
            [
                'slug' => 'chama-of-the-year-2025',
                'title' => 'Chama of the Year 2025',
                'tagline' => 'Kenya’s savings groups, ranked by the people.',
                'description' => 'The 2025 edition — celebrating the merry-go-rounds and investment clubs quietly funding Kenya’s future.',
                'featured_image' => 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80',
                'category' => 'Savings',
                'organizer' => 'KAIG',
                'location' => 'Nationwide',
                'start_date' => '2025-07-01 00:00:00',
                'end_date' => '2025-09-30 23:59:00',
                'vote_price_kes' => 10,
                'status' => 'ended',
                'featured' => false,
                'prize' => 'KES 1,000,000 grant + financial audit sponsorship',
                'rules' => null,
                'sponsors' => null,
            ],
        ];

        foreach ($rows as $r) {
            Campaign::updateOrCreate(['slug' => $r['slug']], $r);
        }
    }
}
