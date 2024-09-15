import {Component, OnInit} from '@angular/core';
import axios from "axios";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";

interface User{
  firstName: string;
  lastName: string;
  email: string;
}
interface Invoice{
  id: string;
  dueDate: Date;
  totalAmount: number;
  status: string;
  user: User;
}
@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css'
})
export class InvoiceListComponent implements OnInit{
  displayedColumnsInvoice: string[] = ['id', 'dueDate', 'totalAmount', 'status', 'user'];
  invoices: Invoice[] = [];
  constructor() {
  }

  ngOnInit() {
    this.getInvoices()
  }

  async getInvoices(){
    await axios.get(`http://localhost:3000/admin/invoices`, {withCredentials:true}).then((response)=>{
      this.invoices = response.data;
      console.log(response.data);
    }).catch(error => {
      console.error('Error fetching invoices:', error);
    });
  }

}
