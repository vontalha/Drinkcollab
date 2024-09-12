export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  brand: string;
  size: number;
  categoryName: string;
  type: 'DRINK' | 'SNACK';
}
