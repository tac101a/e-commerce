'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilters } from '@/components/category-filters';
import { ProductGrid } from '@/components/product-grid';
import { ProductDetail } from '@/components/product-detail';
import { Product } from '@/components/product-card';
import { logPageView, logEvent } from '@/lib/tracking';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Activity, Database, Zap, BarChart3, TrendingUp, Clock } from 'lucide-react';

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();

  // Log page view on mount
  useEffect(() => {
    logPageView('dashboard', {
      initialCategory: activeCategory,
      hasSearchQuery: false,
    });
  }, []);

  const handleLogin = () => {
    toast({
      title: 'Login',
      description: 'Login modal would open here. Event logged to Data Lakehouse.',
    });
  };

  const handleGuest = () => {
    toast({
      title: 'Guest Mode',
      description: 'Continuing as guest. Event logged to Data Lakehouse.',
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    toast({
      title: 'Search Executed',
      description: `Searching for: "${query || 'all products'}". Check console for telemetry.`,
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    toast({
      title: 'Category Changed',
      description: `Filtering by: ${categoryId}. Check console for telemetry.`,
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    toast({
      title: 'Added to Cart',
      description: `${product.name} added. Check console for telemetry.`,
    });
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    logPageView('dashboard', {
      returnedFromProduct: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-1/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <Navbar onLoginClick={handleLogin} onGuestClick={handleGuest} />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            <motion.div
              key="product-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductDetail
                product={selectedProduct}
                onBack={handleBackToProducts}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Dashboard Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="p-3 rounded-2xl bg-primary/10 backdrop-blur-xl border border-primary/20"
                  >
                    <Database className="h-8 w-8 text-primary" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                      Product Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                      Enterprise analytics with real-time Data Lakehouse telemetry
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Stats Banner - Bento Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <GlassStatCard
                  icon={Activity}
                  label="Session Status"
                  value="Active"
                  trend="+12%"
                  color="chart-2"
                />
                <GlassStatCard
                  icon={Zap}
                  label="Events Captured"
                  value="Real-time"
                  trend="Live"
                  color="chart-4"
                />
                <GlassStatCard
                  icon={BarChart3}
                  label="Active Filter"
                  value={activeCategory === 'all' ? 'All Categories' : activeCategory}
                  color="chart-1"
                />
                <GlassStatCard
                  icon={Clock}
                  label="Search Query"
                  value={searchQuery || 'None'}
                  color="primary"
                />
              </motion.div>

              {/* Search & Filters */}
              <div className="space-y-4">
                <SearchBar onSearch={handleSearch} />
                <CategoryFilters onCategoryChange={handleCategoryChange} />
              </div>

              {/* Product Grid */}
              <ProductGrid
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Toaster />
    </div>
  );
}

// Glass morphism stat card component
function GlassStatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  color = 'primary'
}: { 
  icon: React.ElementType;
  label: string; 
  value: string;
  trend?: string;
  color?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-300"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-px bg-${color}/20 opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-500`} />
      
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-xl bg-${color}/10`}>
            <Icon className={`h-4 w-4 text-${color}`} />
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-medium text-chart-2">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-sm font-semibold text-foreground mt-1 truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
