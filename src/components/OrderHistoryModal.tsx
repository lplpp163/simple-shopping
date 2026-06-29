import React from 'react';
import { X, Calendar, Truck, Clipboard, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export default function OrderHistoryModal({ isOpen, onClose, orders }: OrderHistoryModalProps) {
  const [copiedTracking, setCopiedTracking] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      id="order-history-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        id="order-history-modal"
        className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-zinc-900">歷史購買記錄</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
              {orders.length}
            </span>
          </div>
          <button
            id="close-order-history"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1 space-y-6">
          
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 mb-4 border border-zinc-100">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-zinc-700">目前尚無任何購買記錄</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                您建立的第一筆訂單將會記錄在此處。快去挑選一些獨特的設計商品吧！
              </p>
              <button
                onClick={onClose}
                className="mt-5 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                前往選購
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-zinc-100 bg-white p-5 space-y-4 hover:border-zinc-200 transition-all shadow-xs"
                >
                  
                  {/* Order Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">訂單編號</span>
                        <span className="text-xs font-mono font-bold text-zinc-800">{order.id}</span>
                      </div>
                      <div className="h-6 w-[1px] bg-zinc-200"></div>
                      <div>
                        <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">購買日期</span>
                        <span className="text-xs font-medium text-zinc-600">{order.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-100">
                        <CheckCircle2 className="h-3 w-3" /> 已完成付款
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-100">
                        <Truck className="h-3 w-3" /> 配送中
                      </span>
                    </div>
                  </div>

                  {/* Status Progress Visualizer */}
                  <div className="py-2">
                    <div className="relative">
                      {/* Gray line */}
                      <div className="absolute inset-y-1/2 left-0 right-0 h-1 bg-zinc-100 -translate-y-1/2 rounded-full"></div>
                      {/* Active gold line */}
                      <div className="absolute inset-y-1/2 left-0 w-2/3 h-1 bg-amber-500 -translate-y-1/2 rounded-full"></div>

                      {/* Timeline Nodes */}
                      <div className="relative flex justify-between text-center">
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">1</div>
                          <span className="text-[10px] font-bold text-zinc-800 mt-1">訂單已成立</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">2</div>
                          <span className="text-[10px] font-bold text-zinc-800 mt-1">金流已授權</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm animate-pulse">3</div>
                          <span className="text-[10px] font-bold text-amber-600 mt-1">黑貓配送中</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="h-5 w-5 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center text-[10px] font-bold">4</div>
                          <span className="text-[10px] font-medium text-zinc-400 mt-1">送達成功</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="rounded-xl bg-zinc-50/50 p-3.5 space-y-2.5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-md object-cover border bg-white"
                          />
                          <span className="font-medium text-zinc-800 truncate max-w-[200px] sm:max-w-md">
                            {item.name}
                          </span>
                          <span className="text-zinc-400 font-mono text-[10px]">x {item.quantity}</span>
                        </div>
                        <span className="font-bold text-zinc-700">NT$ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Invoice & Pricing Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-4 pt-2">
                    <div className="space-y-1 text-zinc-500">
                      <p>收件地址：{order.shippingAddress.address}</p>
                      <p>收件姓名：{order.shippingAddress.name} ({order.shippingAddress.phone})</p>
                      {order.trackingNumber && (
                        <p className="flex items-center gap-1.5">
                          黑貓運單：<span className="font-mono font-bold text-zinc-700">{order.trackingNumber}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(order.trackingNumber || '');
                              setCopiedTracking(order.trackingNumber || null);
                              setTimeout(() => setCopiedTracking(null), 2000);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                              copiedTracking === order.trackingNumber
                                ? 'bg-green-50 text-green-700'
                                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                            }`}
                          >
                            {copiedTracking === order.trackingNumber ? '已複製 ✓' : '複製'}
                          </button>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">實付金額</span>
                      <span className="text-base font-display font-extrabold text-amber-600">
                        NT$ {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
