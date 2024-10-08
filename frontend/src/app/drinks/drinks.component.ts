import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {CurrencyPipe, NgForOf, NgOptimizedImage} from "@angular/common";
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
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-drinks',
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
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './drinks.component.html',
  styleUrl: './drinks.component.css'
})
export class DrinksComponent implements OnInit{

  products: Product[] = [];
  productsSearch: Product[] = [];
  totalProducts: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;
  searchQuery: string = '';
  sortBy: string = 'sales';
  sortOrder: 'asc' | 'desc' = 'desc';
  // @ts-ignore
  userId: string | null;

  constructor(private productService: ProductService, private cart: CartService, private auth: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.getUserID$().subscribe((value) => {
      this.userId = value;
      this.cd.detectChanges();
    });
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    try {
      const response = await this.productService.getDrinks(
        this.currentPage,
        this.pageSize,
        this.sortBy,
        this.sortOrder,
      );
      this.products = response.data;
      console.log(this.products);
      this.totalProducts = response.total;
      this.totalPages = response.totalPages;
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  // @ts-ignore
  onSearchChange(event: Event): Promise<void> {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.currentPage = 1;
    this.search();
  }
  async search(){
    try {
      await this.productService.searchProduct(
        this.searchQuery
      ).then((response)=>{
        this.productsSearch = response.data;
      });
    } catch (error) {
      console.error('Error fetching products', error);
    }
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
      this.cart.addToCart(this.userId, productId);
    } catch (error) {
      console.error('Error adding product to cart', error);
      alert('There was an error adding the product to the cart.');
    }
  }
}
