import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  cartProducts: any[] = [];

  addProductToCart(product: any) {
    this.cartProducts.push(product);
  }

  getCartProducts() {
    return this.cartProducts;
  }
}
