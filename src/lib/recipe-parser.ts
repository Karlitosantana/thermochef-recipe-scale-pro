import { RecipeData } from '@/types';
import axios from 'axios';

export class RecipeParser {
  private static readonly COMMON_SELECTORS = {
    title: [
      'h1.recipe-name',
      'h1[itemprop="name"]',
      '.recipe-title',
      '.recipe-header h1',
      'h1',
    ],
    description: [
      '.recipe-summary',
      '[itemprop="description"]',
      '.recipe-description',
      '.recipe-intro',
    ],
    ingredients: [
      '[itemprop="recipeIngredient"]',
      '.recipe-ingredient',
      '.ingredient',
      '.ingredients li',
    ],
    instructions: [
      '[itemprop="recipeInstructions"]',
      '.recipe-instruction',
      '.instruction',
      '.directions li',
      '.method li',
    ],
    prepTime: [
      '[itemprop="prepTime"]',
      '.prep-time',
      '.recipe-prep-time',
    ],
    cookTime: [
      '[itemprop="cookTime"]',
      '.cook-time',
      '.recipe-cook-time',
    ],
    servings: [
      '[itemprop="recipeYield"]',
      '.recipe-yield',
      '.servings',
      '.recipe-servings',
    ],
  };

  static async parseFromUrl(url: string): Promise<RecipeData | null> {
    try {
      // In production, this would use a scraping service or server-side function
      // For now, we'll return a placeholder that would be replaced with actual parsing
      const response = await axios.get('/api/parse-recipe', {
        params: { url },
      });

      return response.data;
    } catch (error) {
      console.error('Error parsing recipe:', error);
      return null;
    }
  }

  static parseIngredientLine(line: string): {
    amount: number;
    unit: string;
    name: string;
    notes?: string;
  } {
    // Remove extra whitespace
    line = line.trim();

    // Common ingredient patterns
    const patterns = [
      // "1 1/2 cups flour"
      /^(\d+(?:\s+\d+\/\d+)?)\s+(\w+)\s+(.+)$/,
      // "1.5 kg potatoes"
      /^(\d+(?:\.\d+)?)\s+(\w+)\s+(.+)$/,
      // "2 large eggs"
      /^(\d+)\s+(\w+)\s+(.+)$/,
      // "flour, 2 cups"
      /^(.+),\s+(\d+(?:\.\d+)?)\s+(\w+)$/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const [, amountStr, unit, name] = match;
        const amount = this.parseAmount(amountStr);
        return { amount, unit, name: name.trim() };
      }
    }

    // If no pattern matches, try to extract what we can
    const numberMatch = line.match(/(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)/);
    if (numberMatch) {
      const amount = this.parseAmount(numberMatch[1]);
      const remaining = line.replace(numberMatch[0], '').trim();
      const [unit, ...nameParts] = remaining.split(/\s+/);
      return {
        amount,
        unit: unit || 'unit',
        name: nameParts.join(' ') || remaining,
      };
    }

    // Default: treat the whole line as the ingredient name
    return {
      amount: 1,
      unit: 'unit',
      name: line,
    };
  }

  private static parseAmount(amountStr: string): number {
    // Handle mixed numbers like "1 1/2"
    if (amountStr.includes(' ')) {
      const parts = amountStr.split(' ');
      if (parts.length === 2 && parts[1].includes('/')) {
        const whole = parseFloat(parts[0]);
        const [numerator, denominator] = parts[1].split('/').map(Number);
        return whole + (numerator / denominator);
      }
    }

    // Handle fractions like "1/2"
    if (amountStr.includes('/')) {
      const [numerator, denominator] = amountStr.split('/').map(Number);
      return numerator / denominator;
    }

    // Handle decimals
    return parseFloat(amountStr) || 1;
  }

  static parseTime(timeStr: string): number {
    // Extract numbers and units from strings like "30 minutes" or "1 hour 30 mins"
    const timeRegex = /(\d+)\s*(hours?|hrs?|minutes?|mins?)/gi;
    let totalMinutes = 0;
    let match;

    while ((match = timeRegex.exec(timeStr)) !== null) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      if (unit.startsWith('h')) {
        totalMinutes += value * 60;
      } else {
        totalMinutes += value;
      }
    }

    return totalMinutes;
  }

  static parseServings(servingsStr: string): number {
    const match = servingsStr.match(/\d+/);
    return match ? parseInt(match[0]) : 4; // Default to 4 servings
  }
}