import { RecipeParser } from '../recipe-parser';

describe('RecipeParser', () => {
  describe('parseIngredientLine', () => {
    it('should parse simple ingredient with amount and unit', () => {
      const result = RecipeParser.parseIngredientLine('2 cups flour');
      expect(result).toEqual({
        amount: 2,
        unit: 'cups',
        name: 'flour',
      });
    });

    it('should parse ingredient with fractional amount', () => {
      const result = RecipeParser.parseIngredientLine('1 1/2 cups sugar');
      expect(result).toEqual({
        amount: 1.5,
        unit: 'cups',
        name: 'sugar',
      });
    });

    it('should parse ingredient with decimal amount', () => {
      const result = RecipeParser.parseIngredientLine('0.5 kg potatoes');
      expect(result).toEqual({
        amount: 0.5,
        unit: 'kg',
        name: 'potatoes',
      });
    });

    it('should handle ingredient without clear amount', () => {
      const result = RecipeParser.parseIngredientLine('salt to taste');
      expect(result).toEqual({
        amount: 1,
        unit: 'unit',
        name: 'salt to taste',
      });
    });

    it('should parse ingredient with adjectives', () => {
      const result = RecipeParser.parseIngredientLine('2 large eggs');
      expect(result).toEqual({
        amount: 2,
        unit: 'large',
        name: 'eggs',
      });
    });
  });

  describe('parseTime', () => {
    it('should parse minutes', () => {
      expect(RecipeParser.parseTime('30 minutes')).toBe(30);
      expect(RecipeParser.parseTime('15 mins')).toBe(15);
    });

    it('should parse hours', () => {
      expect(RecipeParser.parseTime('2 hours')).toBe(120);
      expect(RecipeParser.parseTime('1 hr')).toBe(60);
    });

    it('should parse combined hours and minutes', () => {
      expect(RecipeParser.parseTime('1 hour 30 minutes')).toBe(90);
      expect(RecipeParser.parseTime('2 hrs 15 mins')).toBe(135);
    });

    it('should return 0 for unparseable time', () => {
      expect(RecipeParser.parseTime('quick')).toBe(0);
      expect(RecipeParser.parseTime('')).toBe(0);
    });
  });

  describe('parseServings', () => {
    it('should extract number from servings text', () => {
      expect(RecipeParser.parseServings('4 servings')).toBe(4);
      expect(RecipeParser.parseServings('Serves 6')).toBe(6);
      expect(RecipeParser.parseServings('8')).toBe(8);
    });

    it('should return default for unparseable servings', () => {
      expect(RecipeParser.parseServings('varies')).toBe(4);
      expect(RecipeParser.parseServings('')).toBe(4);
    });
  });
});