import React from 'react';
import { ShoppingBag, Search, Heart, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  onOrdersClick: () => void;
  wishlistCount: number;
  onWishlistToggleView: () => void;
  showWishlistOnly: boolean;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  cartCount,
  onCartClick,
  onOrdersClick,
  wishlistCount,
  onWishlistToggleView,
  showWishlistOnly,
}: HeaderProps) {
  return (
    <header id="app-header" className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          id="brand-logo" 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            setSearchQuery('');
            if (showWishlistOnly) onWishlistToggleView();
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-1">
              極簡良品 <span className="text-amber-500 text-sm font-medium px-1.5 py-0.5 bg-amber-50 rounded-md">STORE</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">MINIMALIST SELECT</p>
          </div>
        </div>

        {/* Search Bar */}
        <div id="search-container" className="relative flex-1 max-w-md mx-4 sm:mx-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            id="search-input"
            type="text"
            placeholder="搜尋商品、機能款、降噪..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
          />
          {searchQuery && (
            <button
              id="clear-search"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-zinc-400 hover:text-zinc-600"
            >
              清除
            </button>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div id="nav-actions" className="flex items-center gap-2 sm:gap-4">
          
          {/* Wishlist Button */}
          <button
            id="wishlist-toggle-btn"
            onClick={onWishlistToggleView}
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              showWishlistOnly 
                ? 'border-red-200 bg-red-50 text-red-500' 
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
            title="收藏清單"
          >
            <Heart className={`h-5 w-5 ${showWishlistOnly ? 'fill-current' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Order History Button */}
          <button
            id="order-history-btn"
            onClick={onOrdersClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900"
            title="購買記錄"
          >
            <History className="h-5 w-5" />
          </button>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-zinc-200 hidden sm:block"></div>

          {/* Cart Trigger Button */}
          <button
            id="cart-trigger-btn"
            onClick={onCartClick}
            className="relative flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 shadow-md shadow-zinc-900/10 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">購物車</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-900">
              {cartCount}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
}
