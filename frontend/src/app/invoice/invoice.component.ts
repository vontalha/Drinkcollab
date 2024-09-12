import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import axios from "axios";

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
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
      this.invoiceId=response.data.invoiceId;
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
