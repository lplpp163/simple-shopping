/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Laptop, 
  Shirt, 
  Home, 
  Compass, 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  X, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Truck
} from 'lucide-react';

import { Product, CartItem, Order, Review, Category } from './types';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS } from './data/products';

import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartSidebar from './components/CartSidebar';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryModal from './components/OrderHistoryModal';

export default function App() {
  // --- Persistent States (LocalStorage) ---
  
  // 1. Products (with mutable stock/ratings)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Wishlist / Likes
  const [likedProductIds, setLikedProductIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_liked_ids');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 3. Cart Items
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_cart_items');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 4. Past Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_orders');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 5. Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('store_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    }
    return INITIAL_REVIEWS;
  });

  // --- Search, Filter & UI States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  // --- Promo Code States ---
  const [promoCode, setPromoCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // --- Modal Visibility States ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // --- Save to LocalStorage on updates ---
  useEffect(() => {
    localStorage.setItem('store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('store_liked_ids', JSON.stringify(likedProductIds));
  }, [likedProductIds]);

  useEffect(() => {
    localStorage.setItem('store_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('store_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // --- Helper: Render categories icons dynamically ---
  const getCategoryIcon = (iconName: string) => {
    const iconClass = "h-4 w-4 shrink-0 transition-transform group-hover:scale-110";
    switch (iconName) {
      case 'Store': return <Store className={iconClass} />;
      case 'Laptop': return <Laptop className={iconClass} />;
      case 'Shirt': return <Shirt className={iconClass} />;
      case 'Home': return <Home className={iconClass} />;
      case 'Compass': return <Compass className={iconClass} />;
      default: return <Store className={iconClass} />;
    }
  };

  // --- Shopping Operations ---

  // Add to Cart
  const handleAddToCart = (product: Product, quantity: number, specs?: { [key: string]: string }) => {
    setCartItems((prev) => {
      // Find matches in current cart items with same ID AND same specifications
      const specString = specs ? JSON.stringify(specs) : '';
      const existingIdx = prev.findIndex(
        (item) => 
          item.product.id === product.id && 
          JSON.stringify(item.selectedSpec || {}) === specString
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        // Check stock
        updated[existingIdx].quantity = Math.min(newQty, product.stock);
        return updated;
      }

      return [...prev, { product, quantity, selectedSpec: specs }];
    });
    
    // Auto trigger cart sidebar for feedback
    setIsCartOpen(true);
  };

  // Update Cart Item Quantity
  const handleUpdateCartQuantity = (productId: string, specKey: string, delta: number) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        const itemSpecKey = item.selectedSpec ? JSON.stringify(item.selectedSpec) : '';
        if (item.product.id === productId && itemSpecKey === specKey) {
          const targetQty = item.quantity + delta;
          return {
            ...item,
            quantity: Math.max(1, Math.min(targetQty, item.product.stock))
          };
        }
        return item;
      });
    });
  };

  // Remove single Cart Item
  const handleRemoveCartItem = (productId: string, specKey: string) => {
    setCartItems((prev) => 
      prev.filter((item) => {
        const itemSpecKey = item.selectedSpec ? JSON.stringify(item.selectedSpec) : '';
        return !(item.product.id === productId && itemSpecKey === specKey);
      })
    );
  };

  // Clear entire Cart
  const handleClearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercentage(0);
  };

  // Toggle Like / Wishlist
  const handleLikeToggle = (productId: string) => {
    setLikedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Checkout and Order Placement
  const handlePlaceOrder = (
    shippingAddress: { name: string; phone: string; address: string; email: string },
    paymentMethod: string,
    subtotal: number,
    discount: number,
    total: number
  ) => {
    // 1. Compile order details
    const orderItems = cartItems.map((item) => {
      const specLabel = item.selectedSpec 
        ? ' (' + Object.entries(item.selectedSpec).map(([k, v]) => `${k}:${v}`).join(', ') + ')'
        : '';
      return {
        productId: item.product.id,
        name: item.product.name + specLabel,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      };
    });

    // 2. Generate detailed Receipt Meta
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingSuffix = Math.floor(100000 + Math.random() * 900000);
    
    const newOrder: Order = {
      id: `ORD-2026-${randomSuffix}`,
      items: orderItems,
      subtotal,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      trackingNumber: `TC${trackingSuffix}TW`
    };

    // 3. Subtract stock from products list
    setProducts((prev) => {
      return prev.map((prod) => {
        const cartQty = cartItems
          .filter((item) => item.product.id === prod.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartQty)
        };
      });
    });

    // 4. Save order & Clear Cart
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setPromoCode('');
    setDiscountPercentage(0);

    return newOrder;
  };

  // Add Product Review & recalculate rating dynamically
  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const reviewId = `rev-${Date.now()}`;
    const added: Review = {
      ...newReview,
      id: reviewId,
      date: dateStr,
    };

    const updatedReviews = [added, ...reviews];
    setReviews(updatedReviews);

    // Dynamic rating update for the product
    setProducts((prevProducts) => {
      return prevProducts.map((prod) => {
        if (prod.id === newReview.productId) {
          const productReviews = updatedReviews.filter((r) => r.productId === prod.id);
          const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
          const averageRating = parseFloat((totalRating / productReviews.length).toFixed(1));
          
          return {
            ...prod,
            rating: averageRating,
            reviewCount: productReviews.length,
          };
        }
        return prod;
      });
    });
  };

  // --- Filtering & Sorting Logic ---
  const filteredProducts = products.filter((prod) => {
    // Search keyword query
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category selection
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;

    // Wishlist Filter toggle
    const matchesWishlist = !showWishlistOnly || likedProductIds.includes(prod.id);

    return matchesSearch && matchesCategory && matchesWishlist;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // Default
  });

  return (
    <div id="app-root-layout" className="min-h-screen bg-zinc-50/50 flex flex-col font-sans text-zinc-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* Header component */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
        wishlistCount={likedProductIds.length}
        onWishlistToggleView={() => setShowWishlistOnly(!showWishlistOnly)}
        showWishlistOnly={showWishlistOnly}
      />

      <main className="flex-grow">
        
        {/* Showcase Hero Banner Section (Single Screen friendly, no secondary router) */}
        {!showWishlistOnly && !searchQuery && selectedCategory === 'all' && (
          <section id="showcase-hero" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-zinc-900 to-zinc-800 px-8 py-10 sm:px-12 sm:py-14 text-white shadow-xl shadow-zinc-900/10">
              
              {/* Decorative light elements */}
              <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="relative max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs text-amber-400 font-semibold mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>2026 夏季極簡精選熱銷中</span>
                </div>
                
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  為生活注入極簡質感美學
                </h2>
                
                <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-lg">
                  精選 3C 數位、潮流服飾與居家美學設計，剔除多餘贅飾，只留下對細節的專注與最真實的實用價值。
                </p>

                {/* Promo Code notification box inside Hero */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <div className="inline-block rounded-xl border border-zinc-700/50 bg-zinc-800/60 p-2.5 px-4 text-xs">
                    <span className="text-zinc-400">專屬首購享 10% 折扣優惠！輸入折扣碼：</span>
                    <span className="font-mono font-bold text-amber-400">MINIMALIST10</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById('storefront-grid-panel');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-100 hover:gap-3 active:scale-95 cursor-pointer"
                  >
                    <span>立即探索商品</span>
                    <ArrowRight className="h-4 w-4 text-zinc-950" />
                  </button>
                  
                  <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-amber-500" />
                    台灣本島全館免運（滿 NT$2,000）
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories Pills & Interactive Sorting Header */}
        <section id="storefront-navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200/60 pb-5">
            
            {/* Category Pills list */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                // Calculate item counts dynamically per category
                const itemCount = cat.id === 'all' 
                  ? products.length 
                  : products.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowWishlistOnly(false); // Reset wishlist filter
                    }}
                    className={`group flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected && !showWishlistOnly
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                    <span>{cat.name}</span>
                    <span className={`inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      isSelected && !showWishlistOnly
                        ? 'bg-amber-500 text-zinc-900'
                        : 'bg-zinc-100 text-zinc-400'
                    }`}>
                      {itemCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sorting & Filter info */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">排序方式</span>
              <select
                id="sorting-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 cursor-pointer"
              >
                <option value="default">預設推薦</option>
                <option value="price-low">價格：由低到高</option>
                <option value="price-high">價格：由高到低</option>
                <option value="rating">顧客評價高至低</option>
              </select>
            </div>

          </div>
        </section>

        {/* Main Product Grid Panel */}
        <section id="storefront-grid-panel" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Header notification if filtered */}
          {(showWishlistOnly || searchQuery || selectedCategory !== 'all') && (
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">
                  找到 <span className="font-bold text-zinc-800">{sortedProducts.length}</span> 件商品
                </span>
                {showWishlistOnly && (
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 border border-red-100">
                    僅顯示收藏商品
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                    搜尋：&quot;{searchQuery}&quot;
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowWishlistOnly(false);
                }}
                className="text-xs font-semibold text-amber-600 hover:text-amber-500"
              >
                清除所有過濾條件
              </button>
            </div>
          )}

          {sortedProducts.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 p-8 text-center bg-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 mb-3">
                <X className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-700">無符合條件的商品</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                試著更換其他類別、清除搜尋關鍵字，或將喜歡的商品加入收藏吧！
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowWishlistOnly(false);
                }}
                className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                重設條件
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  isLiked={likedProductIds.includes(product.id)}
                  onLikeToggle={handleLikeToggle}
                />
              ))}
            </div>
          )}

        </section>

      </main>

      {/* Aesthetic Footer Panel */}
      <footer id="app-footer-layout" className="border-t border-zinc-200/60 bg-white/50 py-10 mt-auto shrink-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Values Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8 text-zinc-500 text-xs">
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-5 w-5 text-amber-500 mb-2" />
              <h5 className="font-bold text-zinc-800">100% 正品原廠保證</h5>
              <p className="text-zinc-400 mt-0.5">所有品項皆享 12 個月台灣原廠售後保固</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-5 w-5 text-amber-500 mb-2" />
              <h5 className="font-bold text-zinc-800">黑貓宅配極速到貨</h5>
              <p className="text-zinc-400 mt-0.5">出貨後黑貓 24 小時內送達指定府上</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-5 w-5 text-amber-500 mb-2" />
              <h5 className="font-bold text-zinc-800">安心售後與 7 天鑑賞</h5>
              <p className="text-zinc-400 mt-0.5">不合意即刻享完整便利退換貨服務</p>
            </div>
          </div>

          <div className="h-[1px] bg-zinc-200 w-full mb-6"></div>

          <p className="font-display text-sm font-bold text-zinc-800">
            極簡良品 SELECT STORE
          </p>
          <p className="text-[10px] text-zinc-400 font-mono mt-1">
            © 2026 SIMPLE STORE INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* --- Dynamic Modals & Overlay Drawers --- */}

      {/* 1. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          isLiked={likedProductIds.includes(selectedProduct.id)}
          onLikeToggle={handleLikeToggle}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      )}

      {/* 2. Cart Sidebar (Sliding Drawer) */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCheckoutClick={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        discountPercentage={discountPercentage}
        setDiscountPercentage={setDiscountPercentage}
      />

      {/* 3. Checkout Workflow Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountPercentage={discountPercentage}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* 4. Order History Tracking Modal */}
      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

    </div>
  );
}
