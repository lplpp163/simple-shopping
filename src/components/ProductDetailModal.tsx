import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Send } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, specs?: { [key: string]: string }) => void;
  isLiked: boolean;
  onLikeToggle: (productId: string) => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isLiked,
  onLikeToggle,
  reviews,
  onAddReview,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<{ [key: string]: string }>({});
  
  // Review form states
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState('');

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Initialize selected specifications with the first option of each spec key
  useEffect(() => {
    if (product.specs) {
      const initialSpecs: { [key: string]: string } = {};
      Object.entries(product.specs).forEach(([key, value]) => {
        const options = value.split(',').map((opt) => opt.trim());
        if (options.length > 0) {
          initialSpecs[key] = options[0];
        }
      });
      setSelectedSpecs(initialSpecs);
    }
    setQuantity(1);
    setReviewSubmitMessage('');
  }, [product]);

  const handleSpecSelect = (key: string, value: string) => {
    setSelectedSpecs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSpecs);
    onClose();
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      return;
    }

    onAddReview({
      productId: product.id,
      userName: newReviewName.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
    });

    setNewReviewName('');
    setNewReviewRating(5);
    setNewReviewComment('');
    setReviewSubmitMessage('感謝您的真實評價！該商品評價已更新。');
    
    // Clear message after 3s
    setTimeout(() => {
      setReviewSubmitMessage('');
    }, 4000);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      id="product-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="product-detail-modal"
        className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col md:max-h-none md:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm backdrop-blur-xs transition-all hover:bg-zinc-100 hover:text-zinc-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 max-h-[85vh] md:max-h-[80vh]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Product Media */}
            <div id="detail-image-panel" className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <button
                id="detail-like-btn"
                onClick={() => onLikeToggle(product.id)}
                className={`absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-all hover:scale-110 ${
                  isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Right Column: Order Configuration */}
            <div id="detail-config-panel" className="flex flex-col">
              
              {/* Category tag */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 bg-amber-50 px-2.5 py-1 rounded-md">
                  {product.category === 'electronics' && '3C 數位'}
                  {product.category === 'apparel' && '潮流服飾'}
                  {product.category === 'home' && '居家美學'}
                  {product.category === 'sports' && '戶外運動'}
                </span>
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="font-display mt-3 text-2xl font-bold text-zinc-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating Review Summary */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="h-4.5 w-4.5 fill-current" />
                </div>
                <span className="text-sm font-bold text-zinc-800">{product.rating} / 5.0</span>
                <span className="text-xs text-zinc-400">({productReviews.length || product.reviewCount} 則真實評論)</span>
                <span className="text-zinc-300">|</span>
                <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `現貨庫存: ${product.stock} 件` : '已售完，補貨中'}
                </span>
              </div>

              {/* Price Panel */}
              <div className="mt-4 flex items-baseline gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-100/50">
                <span className="font-display text-2xl font-extrabold text-zinc-900">
                  NT$ {product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-zinc-400 line-through">
                      NT$ {product.originalPrice?.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-sm">
                      限時省 NT$ {(product.originalPrice! - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mt-5">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">商品描述</h4>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Dynamic Spec Selectors */}
              {product.specs && Object.entries(product.specs).map(([specKey, specValue]) => {
                const options = specValue.split(',').map((opt) => opt.trim());
                return (
                  <div key={specKey} className="mt-5">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                      選擇{specKey}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => {
                        const isSelected = selectedSpecs[specKey] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => handleSpecSelect(specKey, option)}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium border transition-all ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 text-amber-600 shadow-sm'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Quantity Adjustment & Total Price Row */}
              <div className="mt-6 border-t border-zinc-100 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">數量</h4>
                    <div className="mt-2 flex items-center border border-zinc-200 rounded-xl w-32 justify-between p-1 bg-white">
                      <button
                        onClick={decrementQty}
                        disabled={quantity <= 1 || product.stock === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 active:scale-95 disabled:text-zinc-300 disabled:hover:bg-transparent"
                      >
                        <span className="text-lg font-bold">-</span>
                      </button>
                      <span className="text-sm font-bold text-zinc-800">{product.stock === 0 ? 0 : quantity}</span>
                      <button
                        onClick={incrementQty}
                        disabled={quantity >= product.stock || product.stock === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 active:scale-95 disabled:text-zinc-300 disabled:hover:bg-transparent"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">小計金額</h4>
                    <span className="mt-1 block font-display text-xl font-bold text-amber-600">
                      NT$ {(product.price * (product.stock === 0 ? 0 : quantity)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add To Cart Master Button */}
              <div className="mt-6 flex gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all active:scale-95 ${
                    product.stock === 0
                      ? 'bg-zinc-200 text-zinc-400 shadow-none cursor-not-allowed'
                      : 'bg-zinc-900 hover:bg-zinc-800 shadow-zinc-900/10 hover:shadow-lg hover:shadow-zinc-900/20'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  {product.stock === 0 ? '商品已售完' : '加到購物車'}
                </button>
              </div>

            </div>

          </div>

          {/* Interactive Customer Review Section */}
          <div id="reviews-section" className="mt-12 border-t border-zinc-100 pt-8">
            <h3 className="font-display text-lg font-bold text-zinc-900 mb-6">顧客真實評價 ({productReviews.length})</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Review List panel */}
              <div className="lg:col-span-2 space-y-4">
                {productReviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center">
                    <p className="text-sm text-zinc-400">目前尚無評論，成為該商品的第一位評價者吧！</p>
                  </div>
                ) : (
                  productReviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-zinc-50 bg-zinc-50/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600 uppercase">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-zinc-800">{review.userName}</span>
                            <div className="flex items-center text-amber-400 mt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-zinc-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-400">{review.date}</span>
                      </div>
                      <p className="mt-3 text-xs text-zinc-600 leading-relaxed pl-10">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Form panel */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-xs">
                <h4 className="font-display text-sm font-bold text-zinc-800 mb-3">分享您的體驗</h4>
                
                {reviewSubmitMessage && (
                  <div className="mb-4 rounded-lg bg-green-50 p-3 text-xs text-green-700 font-medium">
                    {reviewSubmitMessage}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 mb-1">您的名字</label>
                    <input
                      type="text"
                      required
                      placeholder="例：陳先生"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 mb-1">評分星級</label>
                    <div className="flex gap-1.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewReviewRating(i + 1)}
                          className="hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star className={`h-5 w-5 ${i < newReviewRating ? 'fill-current' : 'text-zinc-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-500 mb-1">評論內容</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="跟其他顧客分享您的心得..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-500 text-xs font-bold text-zinc-900 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>送出評論</span>
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
