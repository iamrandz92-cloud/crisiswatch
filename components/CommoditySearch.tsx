'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CommoditySearchProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string | null) => void;
  selectedCategory: string | null;
}

const CATEGORIES = [
  { id: 'all', name: 'All', color: 'bg-neutral-600 hover:bg-neutral-500' },
  { id: 'crypto', name: 'Crypto', color: 'bg-orange-600 hover:bg-orange-500' },
  { id: 'metal', name: 'Metals', color: 'bg-yellow-600 hover:bg-yellow-500' },
  { id: 'energy', name: 'Energy', color: 'bg-blue-600 hover:bg-blue-500' },
  { id: 'agriculture', name: 'Agriculture', color: 'bg-green-600 hover:bg-green-500' },
];

export function CommoditySearch({ onSearch, onCategoryFilter, selectedCategory }: CommoditySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      onCategoryFilter(null);
    } else {
      onCategoryFilter(categoryId);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          type="text"
          placeholder="Search commodities (Bitcoin, Gold, Oil, etc.)"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-500"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            variant="outline"
            size="sm"
            className={`${
              (category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                ? `${category.color} text-white border-transparent`
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
            } transition-colors`}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
