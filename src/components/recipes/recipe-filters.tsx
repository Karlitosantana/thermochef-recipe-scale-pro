'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface RecipeFiltersProps {
  cuisines: string[];
  difficulties: string[];
  currentFilters: {
    search?: string;
    cuisine?: string;
    difficulty?: string;
  };
}

export function RecipeFilters({ cuisines, difficulties, currentFilters }: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentFilters.search || '');

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/dashboard/recipes?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', search);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/dashboard/recipes');
  };

  const hasActiveFilters = currentFilters.search || currentFilters.cuisine || currentFilters.difficulty;

  return (
    <div className="card">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-2">
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
        </form>

        {/* Cuisine Filter */}
        <select
          value={currentFilters.cuisine || ''}
          onChange={(e) => updateFilters('cuisine', e.target.value)}
          className="input"
        >
          <option value="">All Cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={currentFilters.difficulty || ''}
          onChange={(e) => updateFilters('difficulty', e.target.value)}
          className="input"
        >
          <option value="">All Difficulties</option>
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {currentFilters.search && (
              <span className="rounded-full bg-accent/20 px-3 py-1 text-sm text-accent">
                Search: "{currentFilters.search}"
              </span>
            )}
            {currentFilters.cuisine && (
              <span className="rounded-full bg-secondary/20 px-3 py-1 text-sm text-secondary">
                {currentFilters.cuisine}
              </span>
            )}
            {currentFilters.difficulty && (
              <span className="rounded-full bg-background px-3 py-1 text-sm">
                {currentFilters.difficulty}
              </span>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="text-sm text-text-dark hover:text-text"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}