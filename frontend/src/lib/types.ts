export type Category =
  | 'Community'
  | 'Health'
  | 'Education'
  | 'Environment'
  | 'Youth'
  | 'Women'
  | 'Advocacy'
  | 'Farming'
  | 'Savings';

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  featuredImage: string;
  category: Category;
  organizer: string;
  location: string;
  startDate: string;
  endDate: string;
  votePriceKes: number;
  totalVotes: number;
  totalNominees: number;
  status: 'live' | 'upcoming' | 'ended';
  featured?: boolean;
  prize?: string;
  rules?: string[];
  sponsors?: string[];
}

export interface Nominee {
  id: string;
  /** URL-safe slug — used for public nominee URLs */
  slug?: string;
  campaignId: string;
  code: string;
  fullName: string;
  photo: string;
  coverPhoto?: string;
  headline: string;
  bio: string;
  location: string;
  /** Focus / cause area (e.g. Maternal Health, Girl-Child Advocacy) */
  category: string;
  votes: number;
  verified?: boolean;
  achievements?: string[];
  website?: string;
  socials: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?: string;
  };
  // Individual community-worker fields
  role?: string;
  organization?: string;
  yearsOfService?: number;
  peopleReached?: number;
  age?: number;
  languages?: string[];
  programs?: string[];

  // Organization / group fields
  chairperson?: string;
  memberCount?: number;
  foundedYear?: number;
  amountMobilizedKes?: number;
  registrationNo?: string;
  meetingCadence?: string;
}
