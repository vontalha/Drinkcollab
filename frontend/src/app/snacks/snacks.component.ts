import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ShopItemComponent} from "../shop-item/shop-item.component";
import {FlexModule} from "@angular/flex-layout";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {Product} from "../models/product.model";
import {ProductService} from "../services/product.service";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {CartService} from "../services/CartService";

@Component({
  selector: 'app-snacks',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatPaginator,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    ShopItemComponent,
    CurrencyPipe,
    FlexModule,
    MatCard,
    MatCardContent,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle,
    MatButton,
    MatCardActions,
    MatIcon
  ],
  templateUrl: './snacks.component.html',
  styleUrl: './snacks.component.css'
})
export class SnacksComponent {
  //todo
  products: Product[] = [];
  totalProducts: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  sortBy: string = 'sales';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(private productService: ProductService, private cart: CartService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    try {
      const response = await this.productService.getSnacks(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.sortOrder

      );
      this.products = response.data;
      this.totalProducts = response.total;
      this.totalPages = response.totalPages;
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.currentPage = 1;
    this.fetchProducts();
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.fetchProducts();
  }

  onSortOrderChange(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
    this.fetchProducts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }

  async addToCart(productId: string) {
    try {
      // @ts-ignore
      this.cart.addToCart(this.id, productId);
    } catch (error) {
      console.error('Error adding product to cart', error);
      alert('There was an error adding the product to the cart.');
    }
  }
}
