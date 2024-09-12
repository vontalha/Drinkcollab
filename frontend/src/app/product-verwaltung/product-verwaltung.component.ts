import {Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle, MatCardTitle
} from "@angular/material/card";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {ProductVerwaltungDialogComponent} from "../product-verwaltung-dialog/product-verwaltung-dialog.component";
import {Product} from "../models/product.model";
import {MatDialog} from "@angular/material/dialog";
import {ProductService} from "../services/product.service";
import {MatIcon} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";

@Component({
  selector: 'app-product-verwaltung',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    NgForOf,
    MatCardHeader,
    MatCardContent,
    MatCardImage,
    MatCardActions,
    CurrencyPipe,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatCell,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatIcon
  ],
  templateUrl: './product-verwaltung.component.html',
  styleUrl: './product-verwaltung.component.css'
})
export class ProductVerwaltungComponent implements OnInit{
  products: Product[] = [];
  displayedColumns: string[] = ['name', 'image', 'description', 'price', 'quantity', 'actions'];

  constructor(private productService: ProductService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.productService.getAllProducts();
  }

  openDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductVerwaltungDialogComponent, {
      width: '400px',
      data: product || { name: '', image: '', description: '', price: 0, quantity: 0 , stock:0, brand:'', type:'DRINK', categoryName:'' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        if (result.id) {
          await this.productService.updateProduct(result);
        } else {
          await this.productService.createProduct(result);
        }
        this.loadProducts();
      }
    });
  }

  async deleteProduct(id: string) {
    await this.productService.deleteProduct(id);
    this.loadProducts();
  }
}
