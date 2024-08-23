import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "../models/product.model";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import {CurrencyPipe, NgForOf} from "@angular/common";

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
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent implements OnInit{
  products: Product[] = [];
  totalProducts: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  sortBy: string = 'sales';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
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
}
