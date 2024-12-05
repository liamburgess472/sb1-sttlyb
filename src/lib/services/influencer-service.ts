import { supabase } from "@/lib/supabase";
import { type Influencer } from "@/types/influencer";
import { type Recipe } from "@/types/recipe";

export const InfluencerService = {
  getAll: async (): Promise<Influencer[]> => {
    const { data: influencers, error } = await supabase
      .from("influencers")
      .select(`
        id,
        name,
        avatar_url,
        cover_image_url,
        bio,
        social_media,
        specialties,
        followers,
        recipes_count
      `)
      .order("followers", { ascending: false });

    if (error) throw new Error(`Error fetching influencers: ${error.message}`);
    if (!influencers) return [];

    return influencers.map((influencer) => ({
      id: influencer.id,
      name: influencer.name,
      avatar: influencer.avatar_url,
      coverImage: influencer.cover_image_url,
      bio: influencer.bio,
      socialMedia: influencer.social_media || [],
      specialties: influencer.specialties || [],
      followers: influencer.followers || 0,
      recipesCount: influencer.recipes_count || 0,
    }));
  },

  getById: async (id: string): Promise<Influencer | null> => {
    const { data, error } = await supabase
      .from("influencers")
      .select(`
        id,
        name,
        avatar_url,
        cover_image_url,
        bio,
        social_media,
        specialties,
        followers,
        recipes_count
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(`Error fetching influencer with ID ${id}: ${error.message}`);
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar_url,
      coverImage: data.cover_image_url,
      bio: data.bio,
      socialMedia: data.social_media || [],
      specialties: data.specialties || [],
      followers: data.followers || 0,
      recipesCount: data.recipes_count || 0,
    };
  },

  getRecipesByInfluencer: async (influencerId: string): Promise<Recipe[]> => {
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select(`
        id,
        title,
        description,
        image_url,
        prep_time,
        cook_time,
        servings,
        calories,
        tags,
        ingredients,
        instructions,
        nutritional_info,
        influencer:influencers (
          id,
          name,
          avatar_url
        )
      `)
      .eq("influencer_id", influencerId);

    if (error) throw new Error(`Error fetching recipes for influencer ${influencerId}: ${error.message}`);
    if (!recipes) return [];

    return recipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image_url,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      servings: recipe.servings,
      calories: recipe.calories,
      tags: recipe.tags || [],
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      nutritionalInfo: recipe.nutritional_info,
      influencer: {
        id: recipe.influencer?.id,
        name: recipe.influencer?.name || "Unknown",
        avatar: recipe.influencer?.avatar_url || "",
      },
    }));
  },

  create: async (influencer: Omit<Influencer, "id">): Promise<Influencer> => {
    const { data, error } = await supabase
      .from("influencers")
      .insert({
        name: influencer.name,
        avatar_url: influencer.avatar,
        cover_image_url: influencer.coverImage,
        bio: influencer.bio,
        social_media: influencer.socialMedia,
        specialties: influencer.specialties,
        followers: influencer.followers,
        recipes_count: influencer.recipesCount,
      })
      .select()
      .single();

    if (error) throw new Error("Failed to create influencer");

    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar_url,
      coverImage: data.cover_image_url,
      bio: data.bio,
      socialMedia: data.social_media || [],
      specialties: data.specialties || [],
      followers: data.followers || 0,
      recipesCount: data.recipes_count || 0,
    };
  },

  update: async (id: string, updates: Partial<Omit<Influencer, "id">>): Promise<Influencer> => {
    const { data, error } = await supabase
      .from("influencers")
      .update({
        name: updates.name,
        avatar_url: updates.avatar,
        cover_image_url: updates.coverImage,
        bio: updates.bio,
        social_media: updates.socialMedia,
        specialties: updates.specialties,
        followers: updates.followers,
        recipes_count: updates.recipesCount,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error updating influencer ${id}: ${error.message}`);

    return {
      id: data.id,
      name: data.name,
      avatar: data.avatar_url,
      coverImage: data.cover_image_url,
      bio: data.bio,
      socialMedia: data.social_media || [],
      specialties: data.specialties || [],
      followers: data.followers || 0,
      recipesCount: data.recipes_count || 0,
    };
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("influencers").delete().eq("id", id);

    if (error) throw new Error(`Error deleting influencer with ID ${id}: ${error.message}`);
  },
};
