export type ThermomixModel = 'TM5' | 'TM6' | 'TM7';

export type SubscriptionTier = 'FREE' | 'PRO' | 'FAMILY';

export type RecipeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ThermomixStep {
  instruction: string;
  temperature?: number | 'Varoma';
  speed: number;
  time: number; // in seconds
  reverse?: boolean;
  attachment?: string;
}

export interface ConversionRules {
  [key: string]: {
    temp?: number | 'Varoma';
    speed: number;
    reverse?: boolean;
    attachment?: string;
    maxTime?: number;
  };
}

export interface RecipeData {
  title: string;
  description?: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }>;
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings: number;
  sourceUrl?: string;
}

export interface ConvertedRecipe extends RecipeData {
  thermomixSteps: ThermomixStep[];
  deviceModel: ThermomixModel;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserPreferences {
  language: string;
  preferredUnits: 'metric' | 'imperial';
  defaultServings: number;
  thermomixModel: ThermomixModel;
}

export interface PricingTier {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    conversionsPerMonth?: number;
    recipeStorage?: number;
    imageGeneration?: boolean;
    familyMembers?: number;
  };
}