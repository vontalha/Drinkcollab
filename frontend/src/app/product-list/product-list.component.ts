import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../models/product.model";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {CartService} from "../services/CartService";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-product-list',
  standalone: true,
    imports: [
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        MatPaginatorModule,
        MatFormFieldModule,
        FlexLayoutModule,
        MatButtonModule,
        CurrencyPipe,
        NgForOf,
        AsyncPipe,
        MatIcon,
        NgIf,
    ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit{
  // @ts-ignore
  userId: string | null;
  products: Product[] = [];
  totalProducts: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 6;
  searchQuery: string = '';
  sortBy: string = 'price';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private productService: ProductService, private auth: AuthService, private cart: CartService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.getUserID$().subscribe((value) => {
      this.userId = value;
      console.log(value);
      this.cd.detectChanges();
    });
    this.fetchProducts();
  }

  async fetchProducts(): Promise<void> {
    try {
      const response = await this.productService.getProducts(
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
    if(this.searchQuery == ''){
      this.fetchProducts();
    }else{
      this.search();
    }
  }

  async search(){
    try {
      await this.productService.searchProduct(
        this.searchQuery, this.currentPage, this.pageSize
      ).then((response)=>{
        this.products = response.data;
        this.totalProducts = response.total;
        this.totalPages = response.totalPages;
      });
    } catch (error) {
      console.error('Error fetching products', error);
    }
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
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

  onSortOrderChange(order: 'asc' | 'desc'): void {
    this.sortOrder = order;
    this.fetchProducts();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchProducts();
  }
}
