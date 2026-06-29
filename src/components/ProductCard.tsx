import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key | string;
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, spec?: { [key: string]: string }) => void;
  isLiked: boolean;
  onLikeToggle: (productId: string) => void;
}

export default function ProductCard({
  product,
  onProductClick,
  onAddToCart,
  isLiked,
  onLikeToggle,
}: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Handle Quick Add to Cart using first spec value
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Choose default specs if any exist
    const defaultSpecs: { [key: string]: string } = {};
    if (product.specs) {
      Object.entries(product.specs).forEach(([key, value]) => {
        const firstOption = value.split(',')[0].trim();
        defaultSpecs[key] = firstOption;
      });
    }

    onAddToCart(product, 1, defaultSpecs);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onProductClick(product)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100/50 cursor-pointer"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges / Discount Tag overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="inline-flex items-center rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="inline-flex items-center rounded-lg bg-amber-500 px-2 py-1 text-[10px] font-bold text-zinc-900 shadow-sm">
              僅剩 {product.stock} 件
            </span>
          )}
          {product.stock === 0 && (
            <span className="inline-flex items-center rounded-lg bg-zinc-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              已售完
            </span>
          )}
        </div>

        {/* Favorite Toggle Button */}
        <button
          id={`like-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(product.id);
          }}
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-xs transition-all hover:scale-110 active:scale-95 ${
            isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info Content Panel */}
      <div className="flex flex-1 flex-col pt-3 pb-1">
        {/* Category & Tags Row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
            {product.category === 'electronics' && '3C 數位'}
            {product.category === 'apparel' && '潮流服飾'}
            {product.category === 'home' && '居家美學'}
            {product.category === 'sports' && '戶外運動'}
          </span>
          {product.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="inline-flex items-center rounded-md bg-zinc-50 px-1.5 py-0.5 text-[9px] font-medium text-zinc-500 border border-zinc-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Product Title */}
        <h3 className="font-display text-sm font-semibold text-zinc-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating Row */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-zinc-700">{product.rating}</span>
          <span className="text-[10px] text-zinc-400">({product.reviewCount} 評價)</span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-zinc-50">
          <div>
            {hasDiscount && (
              <span className="block text-[10px] text-zinc-400 line-through">
                NT$ {product.originalPrice?.toLocaleString()}
              </span>
            )}
            <span className="font-display text-base font-bold text-zinc-900">
              NT$ {product.price.toLocaleString()}
            </span>
          </div>

          <button
            id={`quick-add-${product.id}`}
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all active:scale-95 ${
              product.stock === 0
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
            }`}
            title="加到購物車"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>加到購物車</span>
          </button>
        </div>
      </div>
    </div>
  );
}
