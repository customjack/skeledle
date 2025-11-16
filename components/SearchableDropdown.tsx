'use client';

import { useState, useRef, useEffect } from 'react';
import { AnatomicalPart } from '@/lib/models/AnatomicalPart';
import { filterAnatomicalParts } from '@/lib/utils/anatomySearch';

interface SearchableDropdownProps {
  parts: AnatomicalPart[];
  onSelect: (part: AnatomicalPart) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function SearchableDropdown({
  parts,
  onSelect,
  disabled = false,
  placeholder = 'Search anatomical parts...',
}: SearchableDropdownProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const meetsLengthRequirement = trimmedQuery.length >= 2;
  const filteredParts = filterAnatomicalParts(parts, query);

  const handleSelect = (part: AnatomicalPart) => {
    onSelect(part);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!shouldShowDropdown) {
      if (e.key !== 'Enter' && meetsLengthRequirement) {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredParts.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredParts[selectedIndex]) {
          handleSelect(filteredParts[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!meetsLengthRequirement) {
      setIsOpen(false);
    }
  }, [meetsLengthRequirement]);

  const shouldShowDropdown = isOpen && !disabled && meetsLengthRequirement;

  return (
    <div ref={dropdownRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (meetsLengthRequirement) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {shouldShowDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredParts.length === 0 ? (
            <div className="px-4 py-3 text-gray-500">No parts found</div>
          ) : (
            filteredParts.map((part, index) => (
              <button
                key={part.id}
                onClick={() => handleSelect(part)}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 ${
                  index === selectedIndex ? 'bg-blue-100' : ''
                }`}
              >
                <div className="font-semibold">{part.name}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
