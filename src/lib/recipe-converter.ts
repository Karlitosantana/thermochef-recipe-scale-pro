import { RecipeData, ConvertedRecipe, ThermomixStep, ThermomixModel } from '@/types';
import { conversionRules, deviceLimits, temperatureMap, timeConversions } from './conversion-rules';
import OpenAI from 'openai';

export class RecipeConverter {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async convertRecipe(
    recipe: RecipeData,
    deviceModel: ThermomixModel
  ): Promise<ConvertedRecipe> {
    const limits = deviceLimits[deviceModel];
    
    // First, use AI to analyze and convert the recipe
    const aiConversion = await this.getAIConversion(recipe, deviceModel, limits);
    
    // Then, apply our rule-based refinements
    const refinedSteps = this.refineSteps(aiConversion.steps, limits);
    
    // Calculate total time and difficulty
    const estimatedTime = refinedSteps.reduce((total, step) => total + step.time, 0);
    const difficulty = this.calculateDifficulty(refinedSteps, recipe.ingredients.length);
    
    return {
      ...recipe,
      thermomixSteps: refinedSteps,
      deviceModel,
      estimatedTime,
      difficulty,
    };
  }

  private async getAIConversion(
    recipe: RecipeData,
    deviceModel: ThermomixModel,
    limits: typeof deviceLimits[ThermomixModel]
  ): Promise<{ steps: ThermomixStep[] }> {
    const prompt = this.buildConversionPrompt(recipe, deviceModel, limits);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert Thermomix recipe converter. Convert recipes into precise Thermomix steps with temperature, speed, and time settings. Always ensure safety and optimal results.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response || '{"steps": []}');
    } catch (error) {
      console.error('AI conversion error:', error);
      // Fallback to rule-based conversion
      return { steps: this.getRuleBasedConversion(recipe.instructions) };
    }
  }

  private buildConversionPrompt(
    recipe: RecipeData,
    deviceModel: ThermomixModel,
    limits: typeof deviceLimits[ThermomixModel]
  ): string {
    return `Convert this recipe for ${deviceModel} (max temp: ${limits.maxTemp}°C, max speed: ${limits.maxSpeed}, bowl capacity: ${limits.capacity}ml):

Title: ${recipe.title}
Servings: ${recipe.servings}

Ingredients:
${recipe.ingredients.map((i: any) => `- ${i.amount} ${i.unit} ${i.name}`).join('\n')}

Instructions:
${recipe.instructions.map((inst: string, i: number) => `${i + 1}. ${inst}`).join('\n')}

Convert to Thermomix steps with this JSON format:
{
  "steps": [
    {
      "instruction": "Step description",
      "temperature": number or "Varoma",
      "speed": number (0-10),
      "time": number (seconds),
      "reverse": boolean (optional),
      "attachment": string (optional, e.g., "butterfly", "Varoma")
    }
  ]
}

Important rules:
- Maximum temperature is ${limits.maxTemp}°C (or "Varoma")
- Butterfly whisk: max speed 4
- Kneading: max 4 minutes at speed 4
- Always add liquids first, then dry ingredients
- Include prep steps (chopping, mixing) where needed`;
  }

  private getRuleBasedConversion(instructions: string[]): ThermomixStep[] {
    const steps: ThermomixStep[] = [];
    
    for (const instruction of instructions) {
      const lowerInstruction = instruction.toLowerCase();
      
      // Find matching conversion rules
      for (const [method, rule] of Object.entries(conversionRules)) {
        if (lowerInstruction.includes(method)) {
          const time = this.extractTime(instruction) || 60; // Default 1 minute
          
          steps.push({
            instruction,
            temperature: rule.temp,
            speed: rule.speed,
            time: Math.min(time, rule.maxTime || time),
            reverse: rule.reverse,
            attachment: rule.attachment,
          });
          break;
        }
      }
      
      // If no rule matches, create a generic step
      if (steps.length === 0 || steps[steps.length - 1].instruction !== instruction) {
        steps.push({
          instruction,
          speed: 1,
          time: 60,
        });
      }
    }
    
    return steps;
  }

  private refineSteps(
    steps: ThermomixStep[],
    limits: typeof deviceLimits[ThermomixModel]
  ): ThermomixStep[] {
    return steps.map((step: ThermomixStep) => {
      // Ensure temperature is within limits
      if (typeof step.temperature === 'number' && step.temperature > limits.maxTemp) {
        step.temperature = limits.maxTemp;
      }
      
      // Ensure speed is within limits
      if (step.speed > limits.maxSpeed) {
        step.speed = limits.maxSpeed;
      }
      
      // Apply butterfly whisk speed limit
      if (step.attachment === 'butterfly' && step.speed > 4) {
        step.speed = 4;
      }
      
      // Ensure time is within limits
      if (step.time > limits.maxTime) {
        step.time = limits.maxTime;
      }
      
      return step;
    });
  }

  private extractTime(instruction: string): number {
    const timeRegex = /(\d+)\s*(hours?|hrs?|minutes?|mins?|seconds?|secs?)/gi;
    let totalSeconds = 0;
    let match;
    
    while ((match = timeRegex.exec(instruction)) !== null) {
      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();
      const multiplier = (timeConversions as any)[unit] || 60;
      totalSeconds += value * multiplier;
    }
    
    return totalSeconds || 60; // Default to 1 minute if no time found
  }

  private calculateDifficulty(
    steps: ThermomixStep[],
    ingredientCount: number
  ): 'easy' | 'medium' | 'hard' {
    const stepCount = steps.length;
    const hasComplexSteps = steps.some(s => 
      s.attachment || 
      s.reverse || 
      (typeof s.temperature === 'number' && s.temperature > 100) ||
      s.speed > 7
    );
    
    if (stepCount <= 5 && ingredientCount <= 8 && !hasComplexSteps) {
      return 'easy';
    } else if (stepCount <= 10 && ingredientCount <= 15) {
      return 'medium';
    } else {
      return 'hard';
    }
  }

  scaleRecipe(recipe: ConvertedRecipe, newServings: number): ConvertedRecipe {
    const scaleFactor = newServings / recipe.servings;
    
    return {
      ...recipe,
      servings: newServings,
      ingredients: recipe.ingredients.map((ingredient: any) => ({
        ...ingredient,
        amount: Math.round(ingredient.amount * scaleFactor * 100) / 100,
      })),
    };
  }
}