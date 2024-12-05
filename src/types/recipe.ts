export interface Recipe {
  id: string;
  title: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  influencer: {
    name: string;
    avatar: string;
  };
  tags: string[];
  description: string;
  ingredients?: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions?: string[];
  nutritionalInfo?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
}

export interface MealPlan {
  id: string;
  date: Date;
  meals: Recipe[];
}