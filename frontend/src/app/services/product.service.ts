import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Product } from '../models/product.model'

interface ProductResponse {
  data: Product[];
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products/all';

  async getProducts(
    page: number,
    pageSize: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<ProductResponse> {
    try {
      const response: AxiosResponse<ProductResponse> = await axios.get(this.apiUrl, {
        params: {
          page: page.toString(),
          pageSize: pageSize.toString(),
          sortBy: sortBy,
          sortOrder: sortOrder,
        },
        withCredentials:true
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products', error);
      throw error;
    }
  }
}
