export interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  customMeal?: string;
  notes?: string;
  servings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeekPlan {
  startDate: Date;
  endDate: Date;
  meals: MealPlan[];
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
  category: string;
  isChecked: boolean;
  recipeId?: string;
  recipeName?: string;
}

export const MEAL_TYPES = [
  { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: 'bg-orange-500' },
  { id: 'lunch', name: 'Lunch', icon: '🥗', color: 'bg-green-500' },
  { id: 'dinner', name: 'Dinner', icon: '🍽️', color: 'bg-blue-500' },
  { id: 'snack', name: 'Snack', icon: '🍎', color: 'bg-purple-500' },
] as const;

export const SHOPPING_CATEGORIES = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Pantry',
  'Frozen',
  'Bakery',
  'Beverages',
  'Other',
] as const;

export function getWeekDates(date: Date): Date[] {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day; // First day is Sunday
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    week.push(day);
  }

  return week;
}

export function getMonthDates(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const dates = [];
  
  // Add days from previous month to fill the first week
  const startDay = firstDay.getDay();
  for (let i = startDay; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    dates.push(prevDate);
  }
  
  // Add all days of the current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    dates.push(new Date(year, month, day));
  }
  
  // Add days from next month to complete the last week
  const endDay = lastDay.getDay();
  for (let i = 1; i < 7 - endDay; i++) {
    const nextDate = new Date(year, month + 1, i);
    dates.push(nextDate);
  }
  
  return dates;
}

export function formatMealPlanDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatMealPlanDate(date1) === formatMealPlanDate(date2);
}

export function getMealsByDate(meals: MealPlan[], date: Date): MealPlan[] {
  return meals.filter(meal => isSameDay(new Date(meal.date), date));
}

export function categorizIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();
  
  if (lowerIngredient.includes('chicken') || lowerIngredient.includes('beef') || 
      lowerIngredient.includes('fish') || lowerIngredient.includes('salmon') ||
      lowerIngredient.includes('pork') || lowerIngredient.includes('lamb')) {
    return 'Meat & Seafood';
  }
  
  if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') ||
      lowerIngredient.includes('butter') || lowerIngredient.includes('egg') ||
      lowerIngredient.includes('yogurt') || lowerIngredient.includes('cream')) {
    return 'Dairy & Eggs';
  }
  
  if (lowerIngredient.includes('tomato') || lowerIngredient.includes('onion') ||
      lowerIngredient.includes('garlic') || lowerIngredient.includes('carrot') ||
      lowerIngredient.includes('potato') || lowerIngredient.includes('lettuce') ||
      lowerIngredient.includes('spinach') || lowerIngredient.includes('apple') ||
      lowerIngredient.includes('banana') || lowerIngredient.includes('orange')) {
    return 'Produce';
  }
  
  if (lowerIngredient.includes('flour') || lowerIngredient.includes('sugar') ||
      lowerIngredient.includes('salt') || lowerIngredient.includes('pepper') ||
      lowerIngredient.includes('oil') || lowerIngredient.includes('vinegar') ||
      lowerIngredient.includes('rice') || lowerIngredient.includes('pasta')) {
    return 'Pantry';
  }
  
  if (lowerIngredient.includes('frozen')) {
    return 'Frozen';
  }
  
  if (lowerIngredient.includes('bread') || lowerIngredient.includes('bagel') ||
      lowerIngredient.includes('croissant')) {
    return 'Bakery';
  }
  
  return 'Other';
}