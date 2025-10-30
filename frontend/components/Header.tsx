'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './Logo';

/**
 * Renders the main navigation bar/header.
 */
export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (pathname === '/') {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/?search=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo/Site Name */}
          <div className="flex items-center space-x-2">
            <Logo />
            <h1 className="text-xl font-bold text-gray-800">Book <span className="font-light">It</span></h1>
          </div>

          {/* Search Input and Button with Admin */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto sm:max-w-md">
            <div className="flex space-x-2 w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="search experiences"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-150 whitespace-nowrap"
              >
                Search
              </button>
            </div>

          
          </div>
        </div>
      </div>
    </header>
  );
};
