'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

const BlogSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Initialize search query from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);

    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }

    // Reset page when searching
    params.delete('page');
    
    router.push(`/blog?${params.toString()}`);
    
    // Reset loading state after navigation
    setTimeout(() => setIsSearching(false), 300);
  }, [searchQuery, searchParams, router]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('');
      handleSearch();
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="mb-8 relative"
      role="search"
      aria-label="Search blog posts"
    >
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search posts..."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSearching}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={18}
          />
        </div>
        <button
          type="submit"
          className={`
            px-6 py-2 bg-blue-600 text-white rounded-lg
            transition-all duration-200
            ${isSearching 
              ? 'opacity-75 cursor-not-allowed' 
              : 'hover:bg-blue-700 active:scale-95'
            }
          `}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default BlogSearch;