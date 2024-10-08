import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import axios from 'axios';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-paypal-button2',
  template: `<div #paypal></div>`,
  standalone: true,
})

export class PaypalButton2Component implements AfterViewInit{
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;

  paypalOrderId: string = '';

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.loadPaypalScript().then(() => {
        if ((window as any).paypal) {
          console.log('PayPal SDK geladen. Versuche, den Button zu rendern...');
          (window as any).paypal.Buttons({
            createOrder: async (data: any, actions: any) => {
              // @ts-ignore
              let token = JSON.parse(localStorage.getItem('accessToken'));
              // @ts-ignore
              let invoicetoken = JSON.parse(localStorage.getItem('invoice'));
              const response = await axios.post('https://localhost:3000/payment/invoice/paypal-order/create', {
                userId: token.userId, invoiceId: invoicetoken.invoiceId,
              }, {withCredentials:true});

              const { orderId, paypalOrderId } = response.data;
              this.paypalOrderId = paypalOrderId;

              return paypalOrderId;
            },
            onApprove: async (data: any, actions: any) => {
              await actions.order.capture();
              await axios.post(`http://localhost:3000/payment/invoice7paypal-order/capture/${this.paypalOrderId}`,{}, {withCredentials:true});
              alert('Transaction completed successfully!');
            },
            onError: (err: any) => {
              console.error('PayPal Fehler:', err);
            }
          }).render(this.paypalElement?.nativeElement);
          console.log('PayPal Button rendern abgeschlossen.');
        } else {
          console.warn('PayPal SDK konnte nicht geladen werden.');
        }
      }).catch(err => {
        console.error('Fehler beim Laden des PayPal SDK:', err);
      });
    }
  }

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && !(window as any).paypal) {
        const script = document.createElement('script');

        script.src = 'https://www.paypal.com/sdk/js?client-id='+environment.PAYPAL_CLIENT_ID+'&currency=EUR';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('PayPal SDK konnte nicht geladen werden.'));
        document.body.appendChild(script);
      } else {
        resolve();
      }
    });
  }
}
