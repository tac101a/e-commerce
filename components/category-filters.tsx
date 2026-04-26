'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { logEvent } from '@/lib/tracking';
import { 
  Laptop, 
  Shirt, 
  Home, 
  Dumbbell, 
  BookOpen, 
  Gamepad2,
  LayoutGrid
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'All', icon: LayoutGrid },
  { id: 'electronics', name: 'Electronics', icon: Laptop },
  { id: 'clothing', name: 'Clothing', icon: Shirt },
  { id: 'home', name: 'Home & Garden', icon: Home },
  { id: 'sports', name: 'Sports', icon: Dumbbell },
  { id: 'books', name: 'Books', icon: BookOpen },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
];

interface CategoryFiltersProps {
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryFilters({ onCategoryChange }: CategoryFiltersProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    logEvent('category_filter', {
      action: 'category_selected',
      categoryId,
      categoryName,
      previousCategory: activeCategory,
      timestamp: new Date().toISOString(),
    });

    setActiveCategory(categoryId);
    onCategoryChange?.(categoryId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <motion.div key={category.id} variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryClick(category.id, category.name)}
                  className={`
                    relative px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-white/10'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-primary rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
