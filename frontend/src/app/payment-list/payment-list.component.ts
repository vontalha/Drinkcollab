import {Component, OnInit} from '@angular/core';
import axios from "axios";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {CurrencyPipe, DatePipe} from "@angular/common";
interface Payment{
  id: string;
  status: string;
  createdAt: Date;
  dueDate: Date;
  method: string;
  amount: number;
  user: User;
}
interface User{
  firstName: string;
  lastName: string;
  email: string;
}
@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    DatePipe,
    CurrencyPipe,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'status', 'createdAt', 'dueDate', 'method', 'amount', 'user'];
  //payments: Payment[] = [];
  payments: Payment[] = [
    {
      id: 'PAY001',
      status: 'Pending',
      createdAt: new Date(),
      dueDate: new Date(),
      method: 'Credit Card',
      amount: 200.00,
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }
    },
    {
      id: 'PAY002',
      status: 'Completed',
      createdAt: new Date(),
      dueDate: new Date(),
      method: 'PayPal',
      amount: 150.75,
      user: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      }
    }
  ];

  ngOnInit() {
    // @ts-ignore
    this.token = JSON.parse(localStorage.getItem('accessToken'));
    this.getPayments()
  }

  getPayments(){
    axios.get( 'http://localhost:3000/admin/payments/', {withCredentials: true})
      .then(response => {
        this.payments = response.data;
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }
}
