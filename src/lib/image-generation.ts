import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export class ImageGenerator {
  static async generateRecipeImage(
    recipeName: string, 
    ingredients: string[], 
    isHD: boolean = false
  ): Promise<string | null> {
    try {
      // Create a descriptive prompt for the recipe
      const mainIngredients = ingredients.slice(0, 3).join(', ');
      const prompt = `A beautiful, professional food photography shot of ${recipeName}, featuring ${mainIngredients}, styled for a cookbook, warm lighting, shallow depth of field, appetizing presentation`;
      
      const model = isHD 
        ? "black-forest-labs/flux-1.1-pro" 
        : "black-forest-labs/flux-schnell";

      const input = {
        prompt,
        width: isHD ? 1024 : 512,
        height: isHD ? 1024 : 512,
        num_outputs: 1,
        guidance_scale: 3.5,
        num_inference_steps: isHD ? 28 : 4,
      };

      const output = await replicate.run(model, { input }) as string[];
      
      return output[0] || null;
    } catch (error) {
      console.error('Image generation error:', error);
      return null;
    }
  }

  static async generateImageFromDescription(
    description: string,
    isHD: boolean = false
  ): Promise<string | null> {
    try {
      const prompt = `Professional food photography: ${description}, cookbook style, warm lighting, appetizing presentation`;
      
      const model = isHD 
        ? "black-forest-labs/flux-1.1-pro" 
        : "black-forest-labs/flux-schnell";

      const input = {
        prompt,
        width: isHD ? 1024 : 512,
        height: isHD ? 1024 : 512,
        num_outputs: 1,
        guidance_scale: 3.5,
        num_inference_steps: isHD ? 28 : 4,
      };

      const output = await replicate.run(model, { input }) as string[];
      
      return output[0] || null;
    } catch (error) {
      console.error('Image generation error:', error);
      return null;
    }
  }
}