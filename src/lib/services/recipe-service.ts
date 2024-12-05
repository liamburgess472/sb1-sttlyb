import { type Recipe } from '@/types/recipe';
import { supabase } from '@/lib/supabase';

export const RecipeService = {
  getAll: async (): Promise<Recipe[]> => {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select(`
        *,
        influencer:influencers (
          id,
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!recipes) return [];

    return recipes.map(recipe => ({
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
        name: recipe.influencer?.name || 'Unknown',
        avatar: recipe.influencer?.avatar_url || '',
      }
    }));
  },

  getById: async (id: string): Promise<Recipe | null> => {
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select(`
        *,
        influencer:influencers (
          id,
          name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!recipe) return null;

    return {
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
        name: recipe.influencer?.name || 'Unknown',
        avatar: recipe.influencer?.avatar_url || ''
      }
    };
  },

  create: async (recipe: any): Promise<Recipe> => {
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        title: recipe.title,
        description: recipe.description,
        image_url: recipe.image,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        calories: recipe.calories,
        tags: recipe.tags,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        influencer_id: recipe.influencerId
      })
      .select(`
        *,
        influencer:influencers (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating recipe:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create recipe - no data returned');
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image_url,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      servings: data.servings,
      calories: data.calories,
      tags: data.tags || [],
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
      nutritionalInfo: data.nutritional_info,
      influencer: {
        id: data.influencer?.id,
        name: data.influencer?.name || 'Unknown',
        avatar: data.influencer?.avatar_url || ''
      }
    };
  },

  update: async (id: string, updates: any): Promise<Recipe> => {
    const { data, error } = await supabase
      .from('recipes')
      .update({
        title: updates.title,
        description: updates.description,
        image_url: updates.image,
        prep_time: updates.prepTime,
        cook_time: updates.cookTime,
        servings: updates.servings,
        calories: updates.calories,
        tags: updates.tags,
        ingredients: updates.ingredients,
        instructions: updates.instructions,
        influencer_id: updates.influencerId
      })
      .eq('id', id)
      .select(`
        *,
        influencer:influencers (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    if (!data) {
      throw new Error('Failed to update recipe - no data returned');
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image_url,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      servings: data.servings,
      calories: data.calories,
      tags: data.tags || [],
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
      nutritionalInfo: data.nutritional_info,
      influencer: {
        id: data.influencer?.id,
        name: data.influencer?.name || 'Unknown',
        avatar: data.influencer?.avatar_url || ''
      }
    };
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};