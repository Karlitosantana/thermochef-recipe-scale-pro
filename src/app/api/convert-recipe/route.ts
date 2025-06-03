import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { RecipeData, ThermomixModel } from '@/types';

// Mock conversion function for demo purposes
function mockConvertRecipe(recipe: RecipeData, deviceModel: ThermomixModel) {
  const thermomixSteps = recipe.instructions.map((instruction, index) => {
    // Basic conversion logic - in production this would use AI
    const step: any = {
      stepNumber: index + 1,
      instruction: instruction,
      time: 60, // Default 1 minute
      speed: 'Speed 4',
      temperature: 0,
      reverseMode: false,
    };

    // Add some basic intelligence based on keywords
    if (instruction.toLowerCase().includes('chop') || instruction.toLowerCase().includes('dice')) {
      step.time = 10;
      step.speed = 'Speed 5';
      step.instruction = `${instruction} using Turbo mode`;
    } else if (instruction.toLowerCase().includes('mix') || instruction.toLowerCase().includes('stir')) {
      step.time = 30;
      step.speed = 'Speed 3';
      step.reverseMode = true;
    } else if (instruction.toLowerCase().includes('cook') || instruction.toLowerCase().includes('heat')) {
      step.time = 300; // 5 minutes
      step.speed = 'Speed 2';
      step.temperature = 100;
    } else if (instruction.toLowerCase().includes('blend') || instruction.toLowerCase().includes('puree')) {
      step.time = 60;
      step.speed = 'Speed 10';
    }

    return step;
  });

  return {
    ...recipe,
    thermomixSteps,
    deviceModel,
    difficulty: 'Medium',
    estimatedTime: thermomixSteps.reduce((total: number, step: any) => total + step.time, 0),
    tips: [
      'Ensure all ingredients are at room temperature for best results',
      'Clean the mixing bowl between steps if needed',
      `This recipe has been optimized for ${deviceModel}`,
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    // For demo, allow unauthenticated access
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { recipe, deviceModel = 'TM6' }: { recipe: RecipeData; deviceModel: ThermomixModel } = body;
    
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe data is required' }, { status: 400 });
    }

    // Mock conversion for demo
    const convertedRecipe = mockConvertRecipe(recipe, deviceModel);

    return NextResponse.json({
      success: true,
      recipe: convertedRecipe,
    });
  } catch (error) {
    console.error('Recipe conversion error:', error);
    return NextResponse.json({ 
      error: 'Failed to convert recipe. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}