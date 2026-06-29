export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  specs: { [key: string]: string };
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpec?: { [key: string]: string };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    email: string;
  };
  paymentMethod: string;
  status: 'pending' | 'shipping' | 'delivered' | 'completed';
  date: string;
  trackingNumber?: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
};
