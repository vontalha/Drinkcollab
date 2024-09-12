import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatCard, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CartService} from "../services/CartService";
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";
import {MatDivider} from "@angular/material/divider";
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {MatLine} from "@angular/material/core";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface Cart {
  id: string;
  userId: string;
  total: number;
  items: CartItem[];
}

@Component({
  selector: 'app-shoping-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatList,
    MatListItem,
    NgForOf,
    MatIconButton,
    MatIcon,
    MatButton,
    CurrencyPipe,
    MatDivider,
    MatNavList,
    MatSidenavContainer,
    MatSidenav,
    MatLine,
    NgIf
  ],
  templateUrl: './shoping-cart.component.html',
  styleUrl: './shoping-cart.component.css'
})
export class ShopingCartComponent implements OnInit{
  //todo
  // @ts-ignore
  isAuthenticated$: Observable<boolean>;
  // @ts-ignore
  userId: Observable<string | null>
  cart: Cart | null = null;

  constructor(private cartService: CartService, private auth: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.isAuthenticated$ = this.auth.isAuthenticated$();
    this.userId = this.auth.getUserID$();
    this.auth.isAuthenticated$().subscribe(status =>{
      if(status){
        this.getWarenkorb();
        // this.cartService.getCart(this.userId.toString()).then((items)=>{
        //   this.cartItems = items;
        //   console.log("cart:");
        //   console.log(this.cartItems);
        // });
      }
    })
    this.cartService.getNewItemStatus().subscribe( status => {
      if (status){
        this.getWarenkorb();
      }
    })

    this.userId.subscribe(() => {
      this.cd.detectChanges();
    });
    // Manuelle Change Detection anstoßen
    this.isAuthenticated$.subscribe(() => {
      this.cd.detectChanges();
    });
  }
  async getWarenkorb(){
    // @ts-ignore
    let token = JSON.parse(localStorage.getItem('accessToken'));
    this.cart = await this.cartService.getCart(token.userId);
    console.log("this.cart:", this.cart);
  }
  calculateTotalPrice(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  increment(itemId: string) {
    // @ts-ignore
    let token = JSON.parse(localStorage.getItem('accessToken'));
    this.cartService.incrementItem(token.userId, itemId);
  }

  decrement(itemId: string) {
    // @ts-ignore
    let token = JSON.parse(localStorage.getItem('accessToken'));
    this.cartService.decrementItem(token.userId, itemId);
  }

  remove(itemId: string) {
    // @ts-ignore
    let token = JSON.parse(localStorage.getItem('accessToken'));
    this.cartService.removeItem(token.userId, itemId);
  }

  checkoutWithPayPal() {

    console.log('PayPal Checkout');
  }

  checkoutInvoice() {
    // @ts-ignore
    let token = JSON.parse(localStorage.getItem('accessToken'));
    this.cartService.createInvoice(token.userId);
    console.log('Rechnung Checkout');
  }
}
