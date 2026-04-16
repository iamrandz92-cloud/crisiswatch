'use client';

import { Category } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const getIcon = (iconName: string | null) => {
    if (!iconName) return Icons.Newspaper;
    const Icon = (Icons as any)[iconName] || Icons.Newspaper;
    return Icon;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
        )}
      >
        All Updates
      </button>
      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.slug)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
              selectedCategory === category.slug
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            )}
          >
            <Icon className="w-4 h-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
