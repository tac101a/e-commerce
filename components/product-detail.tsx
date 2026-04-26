'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { logEvent } from '@/lib/tracking';
import { Product } from './product-card';

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  // Log product view on mount
  useEffect(() => {
    logEvent('product_view', {
      action: 'product_detail_viewed',
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productCategory: product.category,
      productRating: product.rating,
      viewDuration: 0,
    });
  }, [product]);

  const handleBack = () => {
    logEvent('back_click', {
      action: 'back_to_products',
      fromProductId: product.id,
      fromProductName: product.name,
    });
    onBack?.();
  };

  const handleAddToCart = () => {
    logEvent('add_to_cart', {
      action: 'add_to_cart_from_detail',
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productCategory: product.category,
      quantity: 1,
      source: 'product_detail',
    });
    onAddToCart?.(product);
  };

  const handleWishlist = () => {
    logEvent('product_click', {
      action: 'wishlist_clicked',
      productId: product.id,
      productName: product.name,
    });
  };

  const handleShare = () => {
    logEvent('product_click', {
      action: 'share_clicked',
      productId: product.id,
      productName: product.name,
      shareMethod: 'button',
    });
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="aspect-square bg-muted/50 flex items-center justify-center relative">
              <div className="text-8xl text-muted-foreground/50">📦</div>
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-medium px-3 py-1 rounded">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Info Section */}
            <div className="p-6 space-y-6">
              {/* Category & Title */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </p>
                <h1 className="text-2xl font-bold text-foreground mt-2">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`text-sm font-medium ${product.inStock ? 'text-green-500' : 'text-destructive'}`}>
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlist}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RotateCcw className="h-5 w-5" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Description Placeholder */}
      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Product Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            This is a placeholder for the product description. In a production environment, 
            this would contain detailed information about the product including specifications, 
            features, and usage instructions. The Data Lakehouse would track how users interact 
            with this content to improve recommendations and search results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
