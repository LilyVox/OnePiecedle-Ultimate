import React, { useState, useEffect, type ChangeEvent, type KeyboardEvent, useRef } from 'react';
import Fuse from 'fuse.js';

interface SearchBoxProps<T> {
  placeholder?: string;
  data: T[];
  keys: (keyof T)[];
  displayKey: keyof T; // Key to display in input on select
  debounceMs?: number;
  maxVisible?: number;
  onSearch?: (query: string, result: T) => void; // Fires when search button clicked or enter pressed
  renderItem: (item: T) => React.ReactNode;
}

function SearchBox<T extends object>({
  placeholder = 'Search...',
  data,
  keys,
  displayKey,
  debounceMs = 300,
  maxVisible = 10,
  onSearch,
  renderItem,
}: SearchBoxProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [resultPass, setResultPass] = useState<T>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      const fuse = new Fuse(data, {
        keys: keys as string[],
        threshold: 0.3,
      });

      const searchResults = fuse.search(query).map((res) => res.item);
      setResults(searchResults);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, data, keys, debounceMs]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightIndex >= 0 && itemsRef.current[highlightIndex]) {
      itemsRef.current[highlightIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightIndex]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(true);
    setHighlightIndex(-1);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    if(itemsRef.current[0]){
      itemsRef.current[0]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Enter') {
        handleSearchClick()
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && results[highlightIndex]) {
        selectItem(results[highlightIndex]);
      } else {
          handleSearchClick()
      }
    }
  };
  const selectItem = (item: T) => {
    setQuery(String(item[displayKey]));
    setResultPass(item);
    setShowDropdown(false);
    setHighlightIndex(-1);
    // onSearch?.(String(item[displayKey]));
  };
  const handleSearchClick = () => {
    if (resultPass) {
      onSearch?.(query, resultPass);
    }
    setQuery('');
  };

  return (
    <div className='flex flex-row w-max justify-center m-auto p-4 pb-0' ref={containerRef}>
      <div className=''>
        <input
          type='text'
          value={query}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className='border rounded px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none'
        />
        {showDropdown && results.length > 0 && (
          <div
            className='mt-0 bg-amber-500 border rounded shadow-lg z-50 w-1xl overflow-y-auto absolute w-max ml-auto mr-auto left-0 right-15'
            style={{
              maxHeight: `${maxVisible * 2.5}rem`,
            }}>
            {results.map((item, index) => (
              <div
                key={index}
                // following error is fake news
                ref={(el) => (itemsRef.current[index] = el)}
                className={`relative top-full left-0 w-full px-3 py-2 cursor-pointer ${
                  index === highlightIndex ? 'bg-blue-200' : 'hover:bg-blue-250'
                }`}
                onMouseDown={() => selectItem(item)}
                onMouseEnter={() => setHighlightIndex(index)}>
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleSearchClick}
        className='bg-blue-500 dark:bg-amber-700 text-white px-4 py-2 rounded-r hover:bg-blue-600 dark:hover:bg-amber-800 focus:outline-none h-max'>
        Guess
      </button>
    </div>
  );
}

export default SearchBox;
