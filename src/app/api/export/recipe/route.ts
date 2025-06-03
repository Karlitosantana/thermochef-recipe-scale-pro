import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipeId, format = 'json' } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify recipe exists and belongs to user
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        userId: user.id,
      },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        conversions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        nutritionInfo: true,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Check subscription tier for export capabilities
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!subscription || subscription.tier === 'FREE') {
      return NextResponse.json({ 
        error: 'Export feature requires Pro or Family subscription' 
      }, { status: 403 });
    }

    const exportData = {
      title: recipe.title,
      description: recipe.description,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      diet: recipe.diet,
      ingredients: recipe.ingredients.map((ing: any) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        notes: ing.notes,
      })),
      thermomixSteps: recipe.conversions[0]?.steps || [],
      nutritionInfo: recipe.nutritionInfo,
      sourceUrl: recipe.sourceUrl,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Recipe Scale Pro',
    };

    switch (format.toLowerCase()) {
      case 'json':
        return new NextResponse(JSON.stringify(exportData, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.json"`,
          },
        });

      case 'txt':
        const txtContent = generateTextFormat(exportData);
        return new NextResponse(txtContent, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${recipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt"`,
          },
        });

      case 'pdf':
        // For PDF generation, you would typically use a library like puppeteer or jsPDF
        // For now, return an error indicating PDF is not yet implemented
        return NextResponse.json({ 
          error: 'PDF export coming soon' 
        }, { status: 501 });

      default:
        return NextResponse.json({ 
          error: 'Unsupported format. Supported formats: json, txt' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Recipe export error:', error);
    return NextResponse.json({ error: 'Failed to export recipe' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function generateTextFormat(recipe: any): string {
  let content = `${recipe.title}\n`;
  content += '='.repeat(recipe.title.length) + '\n\n';

  if (recipe.description) {
    content += `${recipe.description}\n\n`;
  }

  // Recipe info
  content += 'Recipe Information:\n';
  content += `- Servings: ${recipe.servings}\n`;
  if (recipe.prepTime) content += `- Prep Time: ${recipe.prepTime} minutes\n`;
  if (recipe.cookTime) content += `- Cook Time: ${recipe.cookTime} minutes\n`;
  if (recipe.totalTime) content += `- Total Time: ${recipe.totalTime} minutes\n`;
  if (recipe.difficulty) content += `- Difficulty: ${recipe.difficulty}\n`;
  if (recipe.cuisine) content += `- Cuisine: ${recipe.cuisine}\n`;
  content += '\n';

  // Ingredients
  content += 'Ingredients:\n';
  content += '------------\n';
  recipe.ingredients.forEach((ing: any) => {
    content += `- ${ing.amount} ${ing.unit} ${ing.name}`;
    if (ing.notes) content += ` (${ing.notes})`;
    content += '\n';
  });
  content += '\n';

  // Thermomix Instructions
  if (recipe.thermomixSteps && recipe.thermomixSteps.length > 0) {
    content += 'Thermomix Instructions:\n';
    content += '----------------------\n';
    recipe.thermomixSteps.forEach((step: any, index: number) => {
      content += `${index + 1}. ${step.instruction}\n`;
      content += `   Settings: `;
      if (step.temperature) content += `${step.temperature}°C, `;
      content += `Speed ${step.speed}, ${Math.floor(step.time / 60)}:${(step.time % 60).toString().padStart(2, '0')}`;
      if (step.reverse) content += ', Reverse';
      if (step.attachment) content += `, ${step.attachment}`;
      content += '\n\n';
    });
  }

  // Nutrition info
  if (recipe.nutritionInfo) {
    content += 'Nutrition Information (per serving):\n';
    content += '-----------------------------------\n';
    if (recipe.nutritionInfo.calories) content += `Calories: ${recipe.nutritionInfo.calories}\n`;
    if (recipe.nutritionInfo.protein) content += `Protein: ${recipe.nutritionInfo.protein}g\n`;
    if (recipe.nutritionInfo.carbohydrates) content += `Carbohydrates: ${recipe.nutritionInfo.carbohydrates}g\n`;
    if (recipe.nutritionInfo.fat) content += `Fat: ${recipe.nutritionInfo.fat}g\n`;
    if (recipe.nutritionInfo.fiber) content += `Fiber: ${recipe.nutritionInfo.fiber}g\n`;
    content += '\n';
  }

  content += `\nExported from Recipe Scale Pro on ${new Date().toLocaleDateString()}\n`;
  if (recipe.sourceUrl) {
    content += `Original recipe: ${recipe.sourceUrl}\n`;
  }

  return content;
}