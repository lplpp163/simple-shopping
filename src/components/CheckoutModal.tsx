import React, { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Loader2, Truck, Clipboard, ExternalLink } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onPlaceOrder: (shippingDetails: {
    name: string;
    phone: string;
    address: string;
    email: string;
  }, paymentMethod: string, subtotal: number, discount: number, total: number) => Order;
  discountPercentage: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onPlaceOrder,
  discountPercentage,
}: CheckoutModalProps) {
  // Shipping details state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');

  // Credit card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Workflow states: 'form' | 'processing' | 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 2000 ? 0 : 100;
  const discountAmount = Math.round(subtotal * (discountPercentage / 100));
  const finalTotal = subtotal - discountAmount + shippingFee;

  // Autofill button for test convenience
  const handleAutofill = () => {
    setName('林奇蹟');
    setPhone('0912-345-678');
    setEmail('cshen0328@gmail.com');
    setAddress('台北市信義區信義路五段7號 (台北101)');
    if (paymentMethod === 'credit') {
      setCardNumber('4211 5566 7788 9900');
      setCardExpiry('12/29');
      setCardCvv('101');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) return;

    // Transition to processing to simulate bank authorization
    setStep('processing');

    setTimeout(() => {
      // Create and save order
      const order = onPlaceOrder(
        { name: name.trim(), phone: phone.trim(), address: address.trim(), email: email.trim() },
        paymentMethod,
        subtotal,
        discountAmount,
        finalTotal
      );
      setCreatedOrder(order);
      setStep('success');
    }, 1500);
  };

  return (
    <div
      id="checkout-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="checkout-modal"
        className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden transition-all max-h-[95vh] flex flex-col md:max-h-none md:h-auto"
      >
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6">
          <h2 className="font-display text-lg font-bold text-zinc-900">
            {step === 'form' && '訂單結帳流程'}
            {step === 'processing' && '安全金流授權中...'}
            {step === 'success' && '🎉 訂單已建立成功！'}
          </h2>
          {step !== 'processing' && (
            <button
              id="close-checkout"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 max-h-[80vh]">
          
          {step === 'form' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              
              {/* Left Column: Form (3/5 width) */}
              <form onSubmit={handleSubmit} className="lg:col-span-3 p-6 md:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-zinc-100">
                
                {/* Autofill helper */}
                <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> 想要快速填寫測試資料嗎？
                  </span>
                  <button
                    type="button"
                    onClick={handleAutofill}
                    className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-bold text-zinc-900 hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    一鍵代入
                  </button>
                </div>

                {/* Shipping Form */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">1. 收件人聯絡資訊</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">真實姓名 *</label>
                      <input
                        type="text"
                        required
                        placeholder="例：張志明"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1">手機號碼 *</label>
                      <input
                        type="tel"
                        required
                        placeholder="例：0912345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">收件電子信箱 *</label>
                    <input
                      type="email"
                      required
                      placeholder="例：email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">收件完整地址 *</label>
                    <input
                      type="text"
                      required
                      placeholder="例：台北市信義區信義路五段7號7樓"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 px-3.5 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                    />
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div className="space-y-4 pt-4 border-t border-zinc-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">2. 選擇付款方式</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'credit', label: '信用卡' },
                      { id: 'linepay', label: 'LINE Pay' },
                      { id: 'atm', label: 'ATM 轉帳' },
                      { id: 'cod', label: '貨到付款' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`rounded-xl border py-3 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMethod === method.id
                            ? 'border-amber-500 bg-amber-50/50 text-amber-600 shadow-xs'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        {method.id === 'credit' && <CreditCard className="h-4 w-4" />}
                        {method.id === 'linepay' && <span className="h-4 w-4 rounded-full bg-green-500 text-[8px] text-white font-bold flex items-center justify-center">L</span>}
                        {method.id === 'atm' && <span className="text-xs">＄</span>}
                        {method.id === 'cod' && <Truck className="h-4 w-4" />}
                        <span>{method.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Fields for Credit Card */}
                  {paymentMethod === 'credit' && (
                    <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 space-y-3.5 animate-fade-in">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-500 mb-1">卡號</label>
                        <input
                          type="text"
                          required
                          placeholder="4211 5566 7788 9900"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-500 mb-1">有效期限 (MM/YY)</label>
                          <input
                            type="text"
                            required
                            placeholder="12/29"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-500 mb-1">安全碼 (CVV)</label>
                          <input
                            type="password"
                            required
                            placeholder="101"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'linepay' && (
                    <div className="rounded-xl border border-green-100 bg-green-50/50 p-4 text-xs text-green-800 leading-relaxed animate-fade-in">
                      確認訂單後，將會自動彈出 LINE Pay 掃碼付款頁面。您可在手機端完成安全的點數扣抵與指紋付款。
                    </div>
                  )}

                  {paymentMethod === 'atm' && (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 leading-relaxed animate-fade-in">
                      確認訂單後，我們將自動為您生成一組實體虛擬轉帳帳戶。請在 24 小時內匯入指定金額以防取消。
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 text-xs text-amber-800 leading-relaxed animate-fade-in">
                      貨到付款將加收 0 元手續費。商品配送到指定地址時，由黑貓宅急便物流專員向您收取現金。
                    </div>
                  )}
                </div>

                {/* Trigger Row */}
                <div className="pt-4 border-t border-zinc-100 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-zinc-200 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 active:scale-95 transition-all cursor-pointer"
                  >
                    返回購物車
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-md shadow-zinc-900/10 cursor-pointer"
                  >
                    送出訂單並付款
                  </button>
                </div>

              </form>

              {/* Right Column: Order Preview (2/5 width) */}
              <div className="lg:col-span-2 bg-zinc-50/50 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">訂單內容明細</h3>
                  
                  {/* Item row */}
                  <div className="space-y-3.5 divide-y divide-zinc-100">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex gap-3 pt-3 first:pt-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 rounded-lg object-cover object-center border border-zinc-100 bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-zinc-800 truncate">{item.product.name}</h4>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                            <span>數量 x {item.quantity}</span>
                            <span className="font-semibold text-zinc-700">NT$ {(item.product.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary panel */}
                <div className="border-t border-zinc-200 mt-6 pt-4 space-y-2.5">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>商品總金額</span>
                    <span>NT$ {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-xs text-green-600 font-medium">
                      <span>已套用折扣 ({discountPercentage}%)</span>
                      <span>- NT$ {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>運費金額</span>
                    <span>{shippingFee === 0 ? '免運費' : `NT$ ${shippingFee}`}</span>
                  </div>

                  <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-zinc-900">
                    <span>應付總額</span>
                    <span className="font-display text-base text-amber-600">NT$ {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
              <h3 className="font-display text-base font-bold text-zinc-800">正在連接安全的第三方金流閘道</h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-sm">
                請勿關閉或重新整理此頁面。我們正在以 256 位元 SSL 憑證加密保護，向您的發卡銀行或付款機構申請授權...
              </p>
            </div>
          )}

          {step === 'success' && createdOrder && (
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Receipt Success Banner */}
              <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100 flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-zinc-900 mb-3 shadow-md shadow-amber-500/15">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h3 className="font-display text-lg font-bold text-zinc-900">您的付款已獲成功授權！</h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-md">
                  我們已發送一封訂單確認函與電子發票至您的電子信箱：<span className="font-semibold text-zinc-800">{createdOrder.shippingAddress.email}</span>。請耐心等候物流配送。
                </p>
              </div>

              {/* Receipt details */}
              <div className="rounded-2xl border border-zinc-100 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-zinc-100 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">訂單編號 (可用於追蹤)</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-mono font-bold text-zinc-800">{createdOrder.id}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(createdOrder.id);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-zinc-400 hover:text-zinc-600 p-0.5 rounded flex items-center gap-1"
                        title="複製編號"
                      >
                        {copied ? (
                          <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                            <Check className="h-3 w-3" /> 已複製
                          </span>
                        ) : (
                          <Clipboard className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block text-right">訂單日期</span>
                    <span className="text-xs font-medium text-zinc-700 block mt-0.5">{createdOrder.date}</span>
                  </div>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-zinc-500 mb-1">物流配送資訊</h4>
                    <p className="text-zinc-800 font-medium">收件人：{createdOrder.shippingAddress.name}</p>
                    <p className="text-zinc-800">聯絡電話：{createdOrder.shippingAddress.phone}</p>
                    <p className="text-zinc-800">收件地址：{createdOrder.shippingAddress.address}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-500 mb-1">付款方式及狀態</h4>
                    <p className="text-zinc-800 font-medium">
                      付款類型：
                      {createdOrder.paymentMethod === 'credit' && '信用卡付款 (已授權)'}
                      {createdOrder.paymentMethod === 'linepay' && 'LINE Pay (行動支付已確認)'}
                      {createdOrder.paymentMethod === 'atm' && 'ATM 轉帳 (等待入帳)'}
                      {createdOrder.paymentMethod === 'cod' && '貨到付款 (物流代收)'}
                    </p>
                    <p className="text-zinc-800">金流狀態：<span className="inline-flex items-center rounded-sm bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700">完成付款</span></p>
                    {createdOrder.trackingNumber && (
                      <p className="text-zinc-800">
                        物流追蹤碼：<span className="font-mono font-bold text-amber-600">{createdOrder.trackingNumber}</span> (黑貓宅急便)
                      </p>
                    )}
                  </div>
                </div>

                {/* Items in Receipt */}
                <div className="border-t border-zinc-100 pt-3">
                  <h4 className="text-xs font-bold text-zinc-500 mb-2">購買品項</h4>
                  <div className="space-y-1.5">
                    {createdOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-zinc-600">
                        <span>{item.name} <span className="text-[10px] text-zinc-400">x{item.quantity}</span></span>
                        <span>NT$ {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-zinc-50 pt-2 flex justify-between text-xs font-bold text-zinc-800">
                      <span>已付總額</span>
                      <span className="text-sm font-display text-amber-600">NT$ {createdOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="flex justify-center pt-2">
                <button
                  id="receipt-done-btn"
                  onClick={onClose}
                  className="rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-md shadow-zinc-950/15 cursor-pointer"
                >
                  回到商店繼續購物
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
