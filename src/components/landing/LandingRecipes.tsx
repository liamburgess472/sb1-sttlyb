import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type Recipe } from "@/types/recipe";
import { fetchFeaturedRecipes } from "@/lib/db";

export function LandingRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRecipes() {
      const data = await fetchFeaturedRecipes();
      setRecipes(data.slice(0, 3)); // Only show first 3 recipes
    }
    loadRecipes();
  }, []);

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Featured Recipes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular recipes curated by expert food influencers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="group overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={recipe.influencer.avatar}
                    alt={recipe.influencer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{recipe.influencer.name}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" onClick={() => navigate("/login")}>
            View All Recipes
          </Button>
        </div>
      </div>
    </div>
  );
}