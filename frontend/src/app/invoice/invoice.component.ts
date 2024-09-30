import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import axios from "axios";
import {PaypalButton2Component} from "../paypal-button2/paypal-button2.component";
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    PaypalButton2Component,
    NgForOf,
    DatePipe,
    CurrencyPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatCardTitle,
    MatCardSubtitle
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  invoice = {
    id: "cm1o7oajj00606g0o0xxy6oby",
    dueDate: "2024-09-29T23:28:51.383Z",
    createdAt: "2024-09-29T23:27:51.374Z",
    totalAmount: "1.1",
    orders: [
      {
        createdAt: "2024-09-29T23:27:51.374Z",
        id: "cm1o7oajm00626g0ox25gcig9",
        orderItems: [
          {
            quantity: 1,
            price: "0.55",
            product: {
              name: "Azur Spritzig"
            }
          },
          {
            quantity: 1,
            price: "0.55",
            product: {
              name: "Azur Medium"
            }
          }
        ]
      }
    ],
    user: {
      id: "cm158a7yp000fjshxscs84lvt",
      email: "charlie.brown@example.com"
    }
  };
  invoiceId: string = '';
  paypalOrderId: string = '';
  constructor(private route: ActivatedRoute) {}
  token = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
    this.getInvoice();
  }

  async getInvoice(){
    await axios.get('http://localhost:3000/payment/invoice/'+this.token,{withCredentials:true}).then((response)=>{
      console.log(response.data);
      console.log(response.data.id);
      this.invoice=response.data;
      this.invoiceId=response.data.id;
      console.log("this.invoices: ", this.invoice);
      localStorage.setItem("invoice",JSON.stringify({invoiceId: response.data.id, TokenExpiringAt: Date.now() + 1000 * 3600 * 0.5})); //30 Minuten valid
    });
  }

  postPayment(){
    // @ts-ignore
    let accesstoken = JSON.parse(localStorage.getItem('accessToken'));
    axios.post('http://localhost:3000/payment/invoice/paypal-order/create',{invoiceId: this.invoiceId, userId: accesstoken.userId},{withCredentials:true}).then((response)=>{
      console.log(response.data);
      this.paypalOrderId=response.data.paypalOrderId;
    });
  }

}
