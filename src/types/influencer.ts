export interface SocialMedia {
  platform: "instagram" | "youtube" | "tiktok" | "twitter";
  url: string;
  username: string;
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  bio: string;
  socialMedia: SocialMedia[];
  specialties: string[];
  followers: number;
  recipesCount: number;
}