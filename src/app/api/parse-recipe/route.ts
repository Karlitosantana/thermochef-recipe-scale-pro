import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Mock recipe data for demo
const mockRecipes: Record<string, any> = {
  'carbonara': {
    title: 'Classic Pasta Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, and pancetta',
    ingredients: [
      { amount: 400, unit: 'g', name: 'spaghetti' },
      { amount: 200, unit: 'g', name: 'pancetta or guanciale', notes: 'diced' },
      { amount: 4, unit: '', name: 'large eggs' },
      { amount: 100, unit: 'g', name: 'Pecorino Romano cheese', notes: 'grated' },
      { amount: 1, unit: 'tsp', name: 'black pepper', notes: 'freshly ground' },
      { amount: 1, unit: 'pinch', name: 'salt' },
    ],
    instructions: [
      'Bring a large pot of salted water to boil and cook spaghetti according to package directions',
      'Meanwhile, dice the pancetta into small cubes',
      'In a large pan, cook the pancetta over medium heat until crispy',
      'In a bowl, whisk together eggs, grated cheese, and black pepper',
      'When pasta is cooked, reserve 1 cup of pasta water before draining',
      'Add hot pasta to the pan with pancetta',
      'Remove from heat and quickly stir in the egg mixture, adding pasta water as needed',
      'Toss continuously until creamy and serve immediately with extra cheese and pepper',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
  },
  'chocolate-souffle': {
    title: 'Chocolate Soufflé',
    description: 'Light and airy chocolate soufflé with a molten center',
    ingredients: [
      { amount: 200, unit: 'g', name: 'dark chocolate', notes: '70% cocoa' },
      { amount: 6, unit: '', name: 'eggs', notes: 'separated' },
      { amount: 50, unit: 'g', name: 'sugar' },
      { amount: 30, unit: 'g', name: 'butter' },
      { amount: 1, unit: 'tbsp', name: 'vanilla extract' },
      { amount: 1, unit: 'pinch', name: 'salt' },
    ],
    instructions: [
      'Preheat oven to 190°C and butter ramekins',
      'Melt chocolate and butter together in a double boiler',
      'Beat egg yolks with half the sugar until pale',
      'Mix chocolate mixture into egg yolks',
      'Beat egg whites with salt until soft peaks form',
      'Gradually add remaining sugar and beat to stiff peaks',
      'Fold egg whites into chocolate mixture in thirds',
      'Pour into ramekins and bake for 12-14 minutes',
    ],
    prepTime: 20,
    cookTime: 14,
    servings: 6,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    // For demo, allow unauthenticated access
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // For demo purposes, return mock data based on URL
    let recipeData;
    
    if (url.toLowerCase().includes('carbonara')) {
      recipeData = { ...mockRecipes.carbonara, sourceUrl: url };
    } else if (url.toLowerCase().includes('chocolate') || url.toLowerCase().includes('souffle')) {
      recipeData = { ...mockRecipes['chocolate-souffle'], sourceUrl: url };
    } else {
      // Return a generic recipe for any other URL
      recipeData = {
        title: 'Delicious Recipe',
        description: 'A wonderful recipe parsed from your URL',
        ingredients: [
          { amount: 2, unit: 'cups', name: 'flour' },
          { amount: 1, unit: 'cup', name: 'sugar' },
          { amount: 3, unit: '', name: 'eggs' },
          { amount: 1, unit: 'cup', name: 'milk' },
          { amount: 100, unit: 'g', name: 'butter', notes: 'melted' },
          { amount: 1, unit: 'tsp', name: 'vanilla extract' },
          { amount: 1, unit: 'pinch', name: 'salt' },
        ],
        instructions: [
          'Preheat your oven to 180°C',
          'Mix all dry ingredients in a large bowl',
          'In another bowl, whisk together eggs, milk, and vanilla',
          'Combine wet and dry ingredients',
          'Stir in melted butter',
          'Pour into prepared pan and bake for 25-30 minutes',
          'Cool before serving',
        ],
        prepTime: 15,
        cookTime: 30,
        servings: 8,
        sourceUrl: url,
      };
    }

    return NextResponse.json(recipeData);
  } catch (error) {
    console.error('Recipe parsing error:', error);
    return NextResponse.json({ 
      error: 'Failed to parse recipe. Please check the URL and try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}