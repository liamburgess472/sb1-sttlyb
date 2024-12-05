import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RecipeService } from "@/lib/services/recipe-service";
import { type Recipe } from "@/types/recipe";
import { IngredientInput } from "./recipe/IngredientInput";
import { InstructionsInput } from "./recipe/InstructionsInput";
import { InfluencerSelect } from "./recipe/InfluencerSelect";
import { Loader2 } from "lucide-react";

interface RecipeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecipe?: Recipe;
}

export function RecipeForm({ open, onOpenChange, editingRecipe }: RecipeFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => initializeFormData(editingRecipe));

  useEffect(() => {
    setFormData(initializeFormData(editingRecipe));
  }, [editingRecipe]);

  const initializeFormData = (recipe?: Recipe) => ({
    title: recipe?.title || '',
    description: recipe?.description || '',
    image: recipe?.image || '',
    prepTime: recipe?.prepTime?.toString() || '0',
    cookTime: recipe?.cookTime?.toString() || '0',
    servings: recipe?.servings?.toString() || '4',
    calories: recipe?.calories?.toString() || '0',
    tags: recipe?.tags?.join(', ') || '',
    ingredients: recipe?.ingredients || [],
    instructions: recipe?.instructions || [],
    influencerId: recipe?.influencer?.id || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recipeData = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        prepTime: parseInt(formData.prepTime, 10),
        cookTime: parseInt(formData.cookTime, 10),
        servings: parseInt(formData.servings, 10),
        calories: parseInt(formData.calories, 10),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        influencerId: formData.influencerId,
      };

      const savedRecipe = editingRecipe
        ? await RecipeService.update(editingRecipe.id, recipeData)
        : await RecipeService.create(recipeData);

      toast({
        title: "Success! 🎉",
        description: editingRecipe 
          ? "Recipe updated successfully."
          : "Recipe created successfully.",
        duration: 5000,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: editingRecipe ? "Error updating recipe" : "Error creating recipe",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                name="image" 
                type="url"
                value={formData.image}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (min)</Label>
                <Input 
                  id="prepTime" 
                  name="prepTime" 
                  type="number"
                  value={formData.prepTime}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (min)</Label>
                <Input 
                  id="cookTime" 
                  name="cookTime" 
                  type="number"
                  value={formData.cookTime}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input 
                  id="servings" 
                  name="servings" 
                  type="number"
                  value={formData.servings}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input 
                  id="calories" 
                  name="calories" 
                  type="number"
                  value={formData.calories}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                required 
              />
            </div>

            <InfluencerSelect
              value={formData.influencerId}
              onChange={(value) => setFormData(prev => ({ ...prev, influencerId: value }))}
            />

            <IngredientInput
              ingredients={formData.ingredients}
              onChange={(ingredients) => setFormData(prev => ({ ...prev, ingredients }))}
            />

            <InstructionsInput
              instructions={formData.instructions}
              onChange={(instructions) => setFormData(prev => ({ ...prev, instructions }))}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                editingRecipe ? "Save Changes" : "Create Recipe"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
