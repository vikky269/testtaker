'use client';

import React, { useState } from 'react';
import { Lato } from 'next/font/google';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const lato = Lato({ subsets: ['latin'], variable: '--font-lato', weight: ['400', '700'] });

// ── Filter chip options ─────────────────────────────────────
const FILTER_OPTIONS = {
  difficulty: ['Easy', 'Medium', 'Hard'],
  category:   ['Maths', 'Algebra', 'Geometry', 'Science'],
};

interface NavHeaderProps {
  onSearch?: (val: string) => void;
  onFilter?: (filters: { difficulty: string[]; category: string[] }) => void;
}

export default function NavHeader({ onSearch, onFilter }: NavHeaderProps) {
  const [search, setSearch]           = useState('');
  const [showFilter, setShowFilter]   = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ difficulty: string[]; category: string[] }>({
    difficulty: [], category: [],
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    onSearch?.(val);
  };

  const toggleFilter = (group: 'difficulty' | 'category', val: string) => {
    setActiveFilters((prev) => {
      const arr = prev[group].includes(val)
        ? prev[group].filter((v) => v !== val)
        : [...prev[group], val];
      const next = { ...prev, [group]: arr };
      onFilter?.(next);
      return next;
    });
  };

  const totalActive = activeFilters.difficulty.length + activeFilters.category.length;

  const clearFilters = () => {
    const reset = { difficulty: [], category: [] };
    setActiveFilters(reset);
    onFilter?.(reset);
  };

  return (
    <div className={`${lato.variable} w-full`}>

      {/* ── Hero strip ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f8fef0] via-white to-[#f0faf5] border-b border-gray-100">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#7FB509]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            {/* Title block */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#7FB509]/10 text-[#7FB509] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7FB509]" />
                SmartMathz Test Taker
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1E] font-lato leading-tight">
                Start Your Assessment
              </h1>
              <p className="text-[#6B7280] text-sm sm:text-base mt-1 font-lato">
                Select a test below to begin your preparation.
              </p>
            </div>

            {/* Search + Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search tests..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200
                             rounded-xl shadow-sm placeholder:text-gray-400 font-lato
                             focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
                             transition-all duration-150"
                />
                {search && (
                  <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilter((p) => !p)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl
                            border transition-all duration-150 cursor-pointer
                            ${showFilter
                              ? 'bg-[#7FB509] text-white border-[#7FB509] shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#7FB509] hover:text-[#7FB509]'
                            }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
                {totalActive > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500
                                   text-white text-[10px] font-bold flex items-center justify-center">
                    {totalActive}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Filter panel ── */}
          {showFilter && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Filters</p>
                {totalActive > 0 && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer">
                    Clear all
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {(['difficulty', 'category'] as const).map((group) => (
                  <div key={group}>
                    <p className="text-xs text-gray-500 font-semibold mb-2 capitalize">{group}</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_OPTIONS[group].map((opt) => {
                        const active = activeFilters[group].includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => toggleFilter(group, opt)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer transition-all duration-150
                              ${active
                                ? 'bg-[#7FB509] text-white border-[#7FB509]'
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#7FB509] hover:text-[#7FB509]'
                              }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}