import {Component, Inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {Product} from "../models/product.model";

@Component({
  selector: 'app-product-verwaltung-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatDialogClose,
    MatDialogActions,
    MatLabel,
    MatFormField,
    FormsModule,
    MatInput,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './product-verwaltung-dialog.component.html',
  styleUrl: './product-verwaltung-dialog.component.css'
})

export class ProductVerwaltungDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ProductVerwaltungDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
