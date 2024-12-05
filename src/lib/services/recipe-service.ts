import { type Recipe } from "@/types/recipe";
import { supabase } from "@/lib/supabase";

export const RecipeService = {
  getAll: async (filters?: { tag?: string; limit?: number }): Promise<Recipe[]> => {
    const query = supabase
      .from("recipes")
      .select(
        `
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
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (filters?.tag) {
      query.contains("tags", [filters.tag]);
    }
    if (filters?.limit) {
      query.limit(filters.limit);
    }

    const { data: recipes, error } = await query;

    if (error) throw new Error(`Error fetching recipes: ${error.message}`);
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

  getById: async (id: string): Promise<Recipe | null> => {
    const { data: recipe, error } = await supabase
      .from("recipes")
      .select(
        `
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
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching recipe:", error);
      throw new Error(`Error fetching recipe with ID ${id}: ${error.message}`);
    }

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
        name: recipe.influencer?.name || "Unknown",
        avatar: recipe.influencer?.avatar_url || "",
      },
    };
  },

  create: async (recipe: Omit<Recipe, "id">): Promise<Recipe> => {
    const { data, error } = await supabase
      .from("recipes")
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
        influencer_id: recipe.influencer.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating recipe:", error);
      throw new Error("Failed to create recipe");
    }

    if (!data) {
      throw new Error("Failed to create recipe - no data returned");
    }

    return await RecipeService.getById(data.id); // Ensure strict type
  },

  update: async (id: string, updates: Partial<Recipe>): Promise<Recipe> => {
    const { data, error } = await supabase
      .from("recipes")
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
        influencer_id: updates.influencer?.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Error updating recipe with ID ${id}: ${error.message}`);

    if (!data) throw new Error("Failed to update recipe - no data returned");

    return await RecipeService.getById(id); // Ensure strict type
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) throw new Error(`Error deleting recipe with ID ${id}: ${error.message}`);
  },
};
