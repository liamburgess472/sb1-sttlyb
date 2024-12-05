import { type Influencer } from '@/types/influencer';
import { getInfluencers, addInfluencer } from '@/lib/cache';

export const InfluencerService = {
  getAll: (): Influencer[] => {
    return getInfluencers();
  },

  getById: (id: string): Influencer | undefined => {
    return getInfluencers().find(influencer => influencer.id === id);
  },

  create: (influencer: Omit<Influencer, 'id'>): Influencer => {
    const newInfluencer = {
      ...influencer,
      id: Math.random().toString(36).substr(2, 9)
    };
    addInfluencer(newInfluencer);
    return newInfluencer;
  },

  update: (id: string, updates: Partial<Influencer>): Influencer => {
    const influencers = getInfluencers();
    const index = influencers.findIndex(influencer => influencer.id === id);
    if (index === -1) throw new Error('Influencer not found');

    const updatedInfluencer = { ...influencers[index], ...updates };
    influencers[index] = updatedInfluencer;
    return updatedInfluencer;
  },

  delete: (id: string): void => {
    const influencers = getInfluencers();
    const index = influencers.findIndex(influencer => influencer.id === id);
    if (index === -1) throw new Error('Influencer not found');
    influencers.splice(index, 1);
  },

  search: (query: string): Influencer[] => {
    const influencers = getInfluencers();
    const lowercaseQuery = query.toLowerCase();
    return influencers.filter(influencer => 
      influencer.name.toLowerCase().includes(lowercaseQuery) ||
      influencer.bio.toLowerCase().includes(lowercaseQuery) ||
      influencer.specialties.some(specialty => 
        specialty.toLowerCase().includes(lowercaseQuery)
      )
    );
  }
};