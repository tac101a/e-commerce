'use client';

import { motion } from 'framer-motion';
import { ProductCard, Product } from './product-card';
import { Sparkles } from 'lucide-react';

// Mock product data for demo
const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Noise-Canceling Headphones Pro',
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.7,
    reviewCount: 2341,
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 'prod_002',
    name: 'Premium Cotton Blend T-Shirt',
    price: 34.99,
    rating: 4.5,
    reviewCount: 892,
    category: 'Clothing',
    inStock: true,
  },
  {
    id: 'prod_003',
    name: 'Smart Home Hub Controller',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.3,
    reviewCount: 567,
    category: 'Home',
    inStock: true,
  },
  {
    id: 'prod_004',
    name: 'Professional Yoga Mat Set',
    price: 59.99,
    rating: 4.8,
    reviewCount: 1203,
    category: 'Sports',
    inStock: true,
  },
  {
    id: 'prod_005',
    name: 'Bestselling Fiction Novel Collection',
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviewCount: 4521,
    category: 'Books',
    inStock: true,
  },
  {
    id: 'prod_006',
    name: 'RGB Mechanical Gaming Keyboard',
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviewCount: 1876,
    category: 'Gaming',
    inStock: false,
  },
  {
    id: 'prod_007',
    name: 'Ultra-Slim Laptop Stand',
    price: 49.99,
    rating: 4.4,
    reviewCount: 723,
    category: 'Electronics',
    inStock: true,
  },
  {
    id: 'prod_008',
    name: 'Organic Bamboo Bed Sheets Set',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.7,
    reviewCount: 1456,
    category: 'Home',
    inStock: true,
  },
];

interface ProductGridProps {
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({ onProductClick, onAddToCart }: ProductGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Recommended Products</h2>
            <p className="text-sm text-muted-foreground">Curated picks based on your preferences</p>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground">
          {mockProducts.length} products
        </span>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto"
      >
        {mockProducts.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className={`
              ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}
              ${index === 4 ? 'lg:col-span-2' : ''}
            `}
          >
            <ProductCard
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              featured={index === 0}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
