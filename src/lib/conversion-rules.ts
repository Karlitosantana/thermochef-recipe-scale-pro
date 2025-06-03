import { ConversionRules, ThermomixModel } from '@/types';

export const conversionRules: ConversionRules = {
  // Heating methods
  sauté: { temp: 'Varoma', speed: 1, reverse: true },
  simmer: { temp: 90, speed: 1 },
  boil: { temp: 100, speed: 2 },
  steam: { temp: 'Varoma', speed: 1, attachment: 'Varoma' },
  
  // Mixing methods
  mix: { speed: 3, maxTime: 30 },
  stir: { speed: 1, reverse: true },
  whip: { speed: 4, attachment: 'butterfly', maxTime: 180 },
  knead: { speed: 4, maxTime: 240 },
  
  // Chopping methods
  chop: { speed: 5, maxTime: 10 },
  mince: { speed: 7, maxTime: 15 },
  purée: { speed: 10, maxTime: 60 },
  grind: { speed: 10, maxTime: 30 },
  
  // Other methods
  melt: { temp: 50, speed: 1 },
  warm: { temp: 37, speed: 1 },
  emulsify: { speed: 5, maxTime: 30 },
  ferment: { temp: 37, speed: 0.5, maxTime: 7200 },
};

export const deviceLimits: Record<ThermomixModel, {
  maxTemp: number;
  maxSpeed: number;
  maxTime: number;
  capacity: number;
}> = {
  TM5: {
    maxTemp: 120,
    maxSpeed: 10,
    maxTime: 5940, // 99 minutes
    capacity: 2200, // ml
  },
  TM6: {
    maxTemp: 160,
    maxSpeed: 10,
    maxTime: 5940,
    capacity: 2200,
  },
  TM7: {
    maxTemp: 160,
    maxSpeed: 10,
    maxTime: 5940,
    capacity: 2200,
  },
};

export const temperatureMap: Record<string, number | 'Varoma'> = {
  'low': 50,
  'medium-low': 70,
  'medium': 90,
  'medium-high': 100,
  'high': 120,
  'very high': 'Varoma',
  'max': 'Varoma',
};

export const timeConversions = {
  minute: 60,
  minutes: 60,
  min: 60,
  mins: 60,
  hour: 3600,
  hours: 3600,
  h: 3600,
  second: 1,
  seconds: 1,
  s: 1,
  sec: 1,
  secs: 1,
};

export const unitConversions = {
  // Volume
  l: 1000,
  liter: 1000,
  liters: 1000,
  litre: 1000,
  litres: 1000,
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  millilitre: 1,
  millilitres: 1,
  cup: 240,
  cups: 240,
  tbsp: 15,
  tablespoon: 15,
  tablespoons: 15,
  tsp: 5,
  teaspoon: 5,
  teaspoons: 5,
  
  // Weight
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  g: 1,
  gram: 1,
  grams: 1,
  lb: 453.592,
  pound: 453.592,
  pounds: 453.592,
  oz: 28.3495,
  ounce: 28.3495,
  ounces: 28.3495,
};