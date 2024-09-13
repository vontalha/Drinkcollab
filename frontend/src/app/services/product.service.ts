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

  async getAllProducts(): Promise<Product[]> {
    const response = await axios.get(this.apiUrl,{withCredentials:true});
    return response.data.data;
  }

  async getDrinks(page: number,
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
          type:'DRINK'
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

  async getSnacks(page: number,
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
          type: 'SNACK'
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

  async createProduct(product: Product): Promise<Product> {
    try{
      const res = await axios.post('http://localhost:3000/admin/products/categories/add', {name: product.categoryName, type: product.type}, {withCredentials:true});
      console.log(res.status);
    }catch (error){

    }

    const response = await axios.post('http://localhost:3000/admin/products/add', product, {withCredentials:true});
    console.log(response.data);
    return response.data;

  }

  async updateProduct(product: Product): Promise<Product> {
    const response = await axios.put(`http://localhost:3000/admin/products/update/${product.id}`, product,{withCredentials:true});
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await axios.delete(`http://localhost:3000/admin/products/delete/${id}`,{withCredentials:true}).then((response)=>{
      console.log(response.data);
    });
  }
}
