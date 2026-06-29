import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, selectedSpecKey: string, delta: number) => void;
  onRemoveItem: (productId: string, selectedSpecKey: string) => void;
  onClearCart: () => void;
  onCheckoutClick: () => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discountPercentage: number;
  setDiscountPercentage: (pct: number) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutClick,
  promoCode,
  setPromoCode,
  discountPercentage,
  setDiscountPercentage,
}: CartSidebarProps) {
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(discountPercentage > 0 ? '已套用折扣' : '');

  if (!isOpen) return null;

  // Helpers to get a unique identifier for specs
  const getSpecString = (item: CartItem) => {
    if (!item.selectedSpec) return '';
    return Object.entries(item.selectedSpec)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 2000 || subtotal === 0 ? 0 : 100;
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  const finalTotal = subtotal - discountAmount + shippingFee;

  // Promo code validation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const formattedCode = promoInput.trim().toUpperCase();
    if (!formattedCode) return;

    if (formattedCode === 'MINIMALIST10') {
      setDiscountPercentage(10);
      setPromoCode(formattedCode);
      setPromoSuccess('成功套用：10% 折扣優惠！');
    } else if (formattedCode === 'WELCOME100') {
      // We will handle specific absolute discounts by translating to custom pct or handling in code
      // To keep it simple and compliant with percentage state, let's treat WELCOME100 as 15% off
      setDiscountPercentage(15);
      setPromoCode(formattedCode);
      setPromoSuccess('首購大禮包：成功套用 15% 折扣！');
    } else {
      setPromoError('無效的折扣碼，請試試 "MINIMALIST10"');
    }
  };

  return (
    <div
      id="cart-sidebar-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-zinc-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="cart-sidebar"
        className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header panel */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-zinc-900">您的購物車</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
              {cartItems.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                id="clear-cart-btn"
                onClick={() => {
                  if (confirm('確定要清空購物車嗎？')) onClearCart();
                }}
                className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title="清空購物車"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>清空</span>
              </button>
            )}
            <button
              id="close-cart-sidebar"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-700">您的購物車是空的</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-[200px]">
                去選購心儀的商品，為生活注入極簡質感吧！
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                開始逛逛
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => {
              const specStr = getSpecString(item);
              const specKey = item.selectedSpec ? JSON.stringify(item.selectedSpec) : '';
              
              return (
                <div
                  key={`${item.product.id}-${specKey}-${idx}`}
                  className="flex gap-4 rounded-xl border border-zinc-50 bg-zinc-50/50 p-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-lg object-cover object-center bg-white border border-zinc-100"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-800 truncate" title={item.product.name}>
                      {item.product.name}
                    </h4>
                    {specStr && (
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate bg-white border border-zinc-100 rounded px-1 py-0.5 inline-block">
                        {specStr}
                      </p>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-white p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, specKey, -1)}
                          disabled={item.quantity <= 1}
                          className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:bg-zinc-50 disabled:text-zinc-300"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="text-xs font-bold px-2 text-zinc-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, specKey, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 hover:bg-zinc-50 disabled:text-zinc-300"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-zinc-900">
                        NT$ {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id, specKey)}
                    className="self-start text-zinc-300 hover:text-red-500 p-1 rounded-md transition-colors"
                    title="移除此商品"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Dynamic Cart Summary Panel */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50/50 p-6 space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="請輸入折扣碼 (例：MINIMALIST10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              />
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                套用
              </button>
            </form>
            
            {promoError && <p className="text-[10px] text-red-500 pl-1">{promoError}</p>}
            {promoSuccess && <p className="text-[10px] text-green-600 pl-1 font-medium">{promoSuccess}</p>}

            {/* Price Calculations */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>商品小計</span>
                <span>NT$ {subtotal.toLocaleString()}</span>
              </div>
              
              {discountPercentage > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>優惠折扣 ({discountPercentage}%)</span>
                  <span>- NT$ {discountAmount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-zinc-500">
                <span>運費</span>
                <span>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}`}</span>
              </div>
              
              {shippingFee > 0 && (
                <p className="text-[10px] text-zinc-400 text-right">
                  再買 NT$ {(2000 - subtotal).toLocaleString()} 即可享免運優惠！
                </p>
              )}

              <div className="border-t border-zinc-100 pt-3 flex justify-between text-sm font-bold text-zinc-900">
                <span>總計金額</span>
                <span className="font-display text-base text-amber-600">NT$ {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="cart-checkout-btn"
              onClick={onCheckoutClick}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-semibold text-white shadow-md shadow-zinc-950/10 hover:bg-zinc-800 transition-all active:scale-95 cursor-pointer"
            >
              <CreditCard className="h-4.5 w-4.5" />
              <span>前往結帳</span>
            </button>
            
            <p className="text-[10px] text-zinc-400 text-center">
              🔒 安全結帳與加密保護機制
            </p>

          </div>
        )}

      </div>
    </div>
  );
}
