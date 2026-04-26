'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Sparkles } from 'lucide-react';
import { logEvent } from '@/lib/tracking';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback(() => {
    logEvent('search', {
      action: 'search_submitted',
      searchQuery: query,
      queryLength: query.length,
      hasQuery: query.trim().length > 0,
    });
    onSearch?.(query);
  }, [query, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    logEvent('search', {
      action: 'search_focused',
      currentQuery: query,
    });
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    logEvent('search', {
      action: 'search_cleared',
      previousQuery: query,
    });
    setQuery('');
    onSearch?.('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full"
    >
      <motion.div
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`
          relative flex items-center gap-3 p-1.5 rounded-2xl
          bg-white/5 border backdrop-blur-xl
          transition-all duration-300
          ${isFocused 
            ? 'border-primary/50 shadow-lg shadow-primary/5' 
            : 'border-white/10 hover:border-white/20'
          }
        `}
      >
        {/* Glow effect */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl -z-10"
            />
          )}
        </AnimatePresence>

        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products, categories, or brands..."
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="pl-12 pr-12 h-12 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSearch}
            className="h-10 px-6 rounded-xl bg-primary/90 hover:bg-primary"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Search
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
