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

    const { shoppingListId, format = 'txt' } = await request.json();

    if (!shoppingListId) {
      return NextResponse.json({ error: 'Shopping list ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify shopping list exists and belongs to user
    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: shoppingListId,
        userId: user.id,
      },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: [
            { category: 'asc' },
            { order: 'asc' },
            { name: 'asc' },
          ],
        },
      },
    });

    if (!shoppingList) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
    }

    const exportData = {
      name: shoppingList.name,
      createdAt: shoppingList.createdAt,
      items: shoppingList.items.map((item: any) => ({
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        category: item.category,
        isChecked: item.isChecked,
        recipe: item.recipe?.title,
      })),
      exportedAt: new Date().toISOString(),
      exportedBy: 'Recipe Scale Pro',
    };

    switch (format.toLowerCase()) {
      case 'json':
        return new NextResponse(JSON.stringify(exportData, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${shoppingList.name.replace(/[^a-zA-Z0-9]/g, '_')}.json"`,
          },
        });

      case 'txt':
        const txtContent = generateShoppingListText(exportData);
        return new NextResponse(txtContent, {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="${shoppingList.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt"`,
          },
        });

      case 'csv':
        const csvContent = generateShoppingListCSV(exportData);
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${shoppingList.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv"`,
          },
        });

      default:
        return NextResponse.json({ 
          error: 'Unsupported format. Supported formats: json, txt, csv' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Shopping list export error:', error);
    return NextResponse.json({ error: 'Failed to export shopping list' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function generateShoppingListText(data: any): string {
  let content = `${data.name}\n`;
  content += '='.repeat(data.name.length) + '\n\n';

  // Group items by category
  const itemsByCategory = data.items.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Generate list by category
  Object.keys(itemsByCategory).sort().forEach(category => {
    content += `${category}:\n`;
    content += '-'.repeat(category.length + 1) + '\n';
    
    itemsByCategory[category].forEach((item: any) => {
      const checkbox = item.isChecked ? '[✓]' : '[ ]';
      let line = `${checkbox} ${item.name}`;
      
      if (item.amount && item.unit) {
        line += ` (${item.amount} ${item.unit})`;
      } else if (item.amount) {
        line += ` (${item.amount})`;
      }
      
      if (item.recipe) {
        line += ` - from ${item.recipe}`;
      }
      
      content += line + '\n';
    });
    
    content += '\n';
  });

  content += `\nExported from Recipe Scale Pro on ${new Date().toLocaleDateString()}\n`;
  content += `Total items: ${data.items.length}\n`;
  content += `Checked items: ${data.items.filter((item: any) => item.isChecked).length}\n`;

  return content;
}

function generateShoppingListCSV(data: any): string {
  let content = 'Category,Item,Amount,Unit,Checked,Recipe\n';
  
  data.items.forEach((item: any) => {
    const row = [
      item.category,
      `"${item.name}"`,
      item.amount || '',
      item.unit || '',
      item.isChecked ? 'Yes' : 'No',
      item.recipe ? `"${item.recipe}"` : '',
    ];
    content += row.join(',') + '\n';
  });

  return content;
}