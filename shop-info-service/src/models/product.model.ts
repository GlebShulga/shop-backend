export interface IProduct {
  count: Number;
  description: string;
  id: string
  price: Number;
  title: string;
  category: string;
  rating: IRating;
}

interface IRating {
  rate: Number;
  count: Number
}