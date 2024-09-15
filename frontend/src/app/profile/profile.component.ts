import {Component, OnInit} from '@angular/core';
import axios from 'axios';
import {MatCard, MatCardAvatar, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";

interface Product {
  name: string;
  image: string;
}
interface OrderItem {
  quantity: number;
  price: number;
  product: Product;
}
interface Order{
  id: string;
  createdAt: Date;
  orderItems: OrderItem[];
}
interface Invoice{
  id: string;
  dueDate: Date;
  createdAt: Date;
  totalAmount: number;
  status: string;
  orders: Order[];
}
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
interface PaymentDto{
  method: string;
  status: string;
}
interface DirectCheckout{
  id: string;
  createdAt: Date;
  orderItems: OrderItem[];
  payment: PaymentDto
}
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatIcon,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    CurrencyPipe,
    DatePipe,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatCardAvatar,
    NgForOf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  displayedColumnsInvoice: string[] = ['id', 'createdAt', 'dueDate', 'totalAmount', 'status'];
  displayedColumnsPayment: string[] = ['id', 'status', 'createdAt', 'dueDate', 'method', 'amount', 'user'];
  displayedColumnsDirect: string[] = ['id', 'createdAt', 'paymentMethod', 'paymentStatus'];
  apiUrl: string = 'http://localhost:3000';
  //todo
  profile = {
    firstName: '',
    lastName: '',
    email: ''
  };
  invoices: Invoice[] = [];
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
  //directcheckouts: any[] = [];
  directCheckouts: DirectCheckout[] = [
    {
      id: 'checkout_001',
      createdAt: new Date('2023-04-15T10:30:00'),
      orderItems: [
        {
          quantity: 2,
          price: 25.50,
          product: { name: 'Product 1', image: 'https://via.placeholder.com/50' }
        },
        {
          quantity: 1,
          price: 99.75,
          product: { name: 'Product 2', image: 'https://via.placeholder.com/50' }
        }
      ],
      payment: { method: 'Credit Card', status: 'Completed' }
    },
    {
      id: 'checkout_002',
      createdAt: new Date('2023-04-16T09:45:00'),
      orderItems: [
        {
          quantity: 3,
          price: 25.08,
          product: { name: 'Product 3', image: 'https://via.placeholder.com/50' }
        }
      ],
      payment: { method: 'PayPal', status: 'Pending' }
    }
  ];
  token: any;

  constructor() {}

  ngOnInit(): void {
    this.getProfileData();
    // @ts-ignore
    this.token = JSON.parse(localStorage.getItem('accessToken'));
    this.getInvoices();
    this.getPayments();
    this.getDirectCheckouts();
  }

  getProfileData() {
    axios.get(this.apiUrl + '/user/me', {withCredentials: true})
      .then(response => {
        this.profile.firstName=response.data.firstName;
        this.profile.lastName=response.data.lastName;
        this.profile.email=response.data.email;
        this.profile = response.data;
        console.log("profile",this.profile);
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }

  getInvoices() {
    axios.get(this.apiUrl + '/user/invoices/' + this.token.userId, {withCredentials: true})
      .then(response => {
        this.invoices = response.data;
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
      });
  }
  getPayments(){
    axios.get(this.apiUrl + '/user/payments/' + this.token.userId, {withCredentials: true})
      .then(response => {
        this.payments = response.data;
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
      });
  }

  getDirectCheckouts(){
  axios.get(this.apiUrl + '/user/directCheckout/' + this.token.userId, {withCredentials: true})
    .then(response => {
    this.directCheckouts = response.data;
    })
    .catch(error => {
      console.error('Error fetching directcheckouts:', error);
    });
}
}
