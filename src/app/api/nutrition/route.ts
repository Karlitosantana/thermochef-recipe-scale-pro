import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Basic nutrition database - in production, you'd use a proper nutrition API
const nutritionDatabase: { [key: string]: any } = {
  // Proteins (per 100g)
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0 },
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0 },
  
  // Vegetables (per 100g)
  'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
  'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
  'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8 },
  
  // Grains (per 100g)
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
  'flour': { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7 },
  
  // Dairy (per 100g)
  'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 },
  
  // Default for unknown ingredients
  'default': { calories: 50, protein: 1, carbs: 10, fat: 0.5, fiber: 1 },
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipeId, ingredients, servings = 4 } = await request.json();

    if (!recipeId && !ingredients) {
      return NextResponse.json({ 
        error: 'Either recipe ID or ingredients array is required' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let recipeIngredients = ingredients;

    // If recipe ID is provided, fetch ingredients from database
    if (recipeId) {
      const recipe = await prisma.recipe.findFirst({
        where: {
          id: recipeId,
          userId: user.id,
        },
        include: {
          ingredients: true,
        },
      });

      if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }

      recipeIngredients = recipe.ingredients;
    }

    // Calculate nutrition
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
    };

    for (const ingredient of recipeIngredients) {
      const nutrition = calculateIngredientNutrition(ingredient);
      totalNutrition.calories += nutrition.calories;
      totalNutrition.protein += nutrition.protein;
      totalNutrition.carbohydrates += nutrition.carbohydrates;
      totalNutrition.fat += nutrition.fat;
      totalNutrition.fiber += nutrition.fiber;
    }

    // Calculate per serving
    const perServing = {
      calories: Math.round(totalNutrition.calories / servings),
      protein: Math.round((totalNutrition.protein / servings) * 10) / 10,
      carbohydrates: Math.round((totalNutrition.carbohydrates / servings) * 10) / 10,
      fat: Math.round((totalNutrition.fat / servings) * 10) / 10,
      fiber: Math.round((totalNutrition.fiber / servings) * 10) / 10,
    };

    // If recipe ID was provided, save nutrition info to database
    if (recipeId) {
      await prisma.nutritionInfo.upsert({
        where: { recipeId },
        create: {
          recipeId,
          ...perServing,
        },
        update: perServing,
      });
    }

    return NextResponse.json({
      total: totalNutrition,
      perServing,
      servings,
    });
  } catch (error) {
    console.error('Nutrition calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate nutrition' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function calculateIngredientNutrition(ingredient: any): any {
  const name = ingredient.name.toLowerCase();
  let amount = ingredient.amount || 0;
  const unit = ingredient.unit?.toLowerCase() || '';

  // Convert to grams (approximate conversions)
  let amountInGrams = amount;
  
  switch (unit) {
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      amountInGrams = amount * 1000;
      break;
    case 'lb':
    case 'pound':
    case 'pounds':
      amountInGrams = amount * 453.592;
      break;
    case 'oz':
    case 'ounce':
    case 'ounces':
      amountInGrams = amount * 28.3495;
      break;
    case 'cup':
    case 'cups':
      // Approximate conversion - varies by ingredient
      amountInGrams = amount * 240; // assuming liquid
      break;
    case 'tbsp':
    case 'tablespoon':
    case 'tablespoons':
      amountInGrams = amount * 15;
      break;
    case 'tsp':
    case 'teaspoon':
    case 'teaspoons':
      amountInGrams = amount * 5;
      break;
    case 'ml':
    case 'milliliter':
    case 'milliliters':
    case 'l':
    case 'liter':
    case 'liters':
      // For liquids, assume 1ml = 1g
      amountInGrams = unit.startsWith('l') ? amount * 1000 : amount;
      break;
    default:
      // If unit is not recognized, assume it's already in grams or treat as whole items
      if (['piece', 'pieces', 'item', 'items', 'whole', 'unit', 'units'].includes(unit)) {
        amountInGrams = amount * 100; // Assume 100g per piece
      }
      break;
  }

  // Find nutrition data
  let nutritionData = nutritionDatabase.default;
  
  // Look for exact matches first
  if (nutritionDatabase[name]) {
    nutritionData = nutritionDatabase[name];
  } else {
    // Look for partial matches
    for (const key of Object.keys(nutritionDatabase)) {
      if (name.includes(key) || key.includes(name)) {
        nutritionData = nutritionDatabase[key];
        break;
      }
    }
  }

  // Calculate nutrition based on amount (nutrition data is per 100g)
  const factor = amountInGrams / 100;
  
  return {
    calories: nutritionData.calories * factor,
    protein: nutritionData.protein * factor,
    carbohydrates: nutritionData.carbs * factor,
    fat: nutritionData.fat * factor,
    fiber: nutritionData.fiber * factor,
  };
}