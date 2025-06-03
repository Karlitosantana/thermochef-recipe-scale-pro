import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecipeData, ConvertedRecipe, ThermomixModel, UserPreferences } from '@/types';

interface RecipeState {
  // Current recipe being converted
  currentRecipe: RecipeData | null;
  convertedRecipe: ConvertedRecipe | null;
  isConverting: boolean;
  conversionError: string | null;
  
  // User preferences
  userPreferences: UserPreferences;
  
  // Actions
  setCurrentRecipe: (recipe: RecipeData | null) => void;
  setConvertedRecipe: (recipe: ConvertedRecipe | null) => void;
  setIsConverting: (isConverting: boolean) => void;
  setConversionError: (error: string | null) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  clearConversion: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      // Initial state
      currentRecipe: null,
      convertedRecipe: null,
      isConverting: false,
      conversionError: null,
      userPreferences: {
        language: 'en',
        preferredUnits: 'metric',
        defaultServings: 4,
        thermomixModel: 'TM6',
      },
      
      // Actions
      setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
      setConvertedRecipe: (recipe) => set({ convertedRecipe: recipe }),
      setIsConverting: (isConverting) => set({ isConverting }),
      setConversionError: (error) => set({ conversionError: error }),
      updateUserPreferences: (preferences) => 
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),
      clearConversion: () => 
        set({
          currentRecipe: null,
          convertedRecipe: null,
          conversionError: null,
          isConverting: false,
        }),
    }),
    {
      name: 'recipe-store',
      partialize: (state) => ({ userPreferences: state.userPreferences }),
    }
  )
);

interface UIState {
  // UI state
  sidebarOpen: boolean;
  recipeViewMode: 'grid' | 'list';
  activeFilters: {
    cuisine?: string;
    diet?: string[];
    difficulty?: string;
    time?: number;
  };
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setRecipeViewMode: (mode: 'grid' | 'list') => void;
  updateFilters: (filters: Partial<UIState['activeFilters']>) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarOpen: true,
      recipeViewMode: 'grid',
      activeFilters: {},
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setRecipeViewMode: (mode) => set({ recipeViewMode: mode }),
      updateFilters: (filters) => 
        set((state) => ({
          activeFilters: { ...state.activeFilters, ...filters },
        })),
      clearFilters: () => set({ activeFilters: {} }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ 
        recipeViewMode: state.recipeViewMode,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);