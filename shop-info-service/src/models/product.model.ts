export interface Product {
  id: string;
  title: string;
  description: string;
  price: Number;
}

export interface Stock {
  product_id: string;
  count: Number
}