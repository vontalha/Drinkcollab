import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import axios from "axios";
import {PaypalButton2Component} from "../paypal-button2/paypal-button2.component";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    PaypalButton2Component,
    NgForOf,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  invoices = [{
    id: "",
    dueDate: "2023-04-15T00:00:00.000Z",
    createdAt: "2023-03-15T10:30:00.000Z",
    totalAmount: 0.0,
    orders: [
      {
        createdAt: "2023-03-14T14:20:00.000Z",
        orderItems: [
          {
            id: "",
            productId: "",
            quantity: 0,
            price: 0
          }
        ]
      }
    ],
    user: {
      id: "",
      email: ""
    }
  }];
  invoiceId: string = '';
  paypalOrderId: string = '';
  constructor(private route: ActivatedRoute) {}
  token = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    this.getInvoice();
  }

  getInvoice(){
    axios.get('https://localhost:3000/payment/invoice?token='+this.token,{withCredentials:true}).then((response)=>{
      console.log(response.data);
      this.invoices=response.data;
      this.invoiceId=response.data.invoiceId;
      localStorage.setItem("invoice",JSON.stringify({invoiceId: response.data.invoiceId, TokenExpiringAt: Date.now() + 1000 * 3600 * 0.5})); //30 Minuten valid
    });
  }

  postPayment(){
    // @ts-ignore
    let accesstoken = JSON.parse(localStorage.getItem('accessToken'));
    axios.post('https://localhost:3000/payment/invoice/paypal-order/create',{invoiceId: this.invoiceId, userId: accesstoken.userId},{withCredentials:true}).then((response)=>{
      console.log(response.data);
      this.paypalOrderId=response.data.paypalOrderId;
    });
  }

}
