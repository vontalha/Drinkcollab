import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import axios from 'axios';
import {environment} from "../../environments/environment";
import {CartService} from "../services/CartService";

@Component({
  selector: 'app-paypal-button',
  template: `<div #paypal></div>`,
  standalone: true,
})

export class PaypalButtonComponent implements AfterViewInit{
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;

  constructor(private cartService: CartService) {
  }
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
              let carttoken = JSON.parse(localStorage.getItem('cart'));
              const response = await axios.post('http://localhost:3000/order/create', {
                userId: token.userId, cartId: carttoken.cartId, paymentMethod: 'PAYPAL'
              }, {withCredentials:true});
              const { orderId, paypalOrderId } = response.data;
              this.paypalOrderId = paypalOrderId;

              return paypalOrderId;
            },
            onApprove: async (data: any, actions: any) => {
              console.log(data);
              //await actions.order.capture();
              console.log(this.paypalOrderId);
              await axios.post(`http://localhost:3000/order/${this.paypalOrderId}/capture`,{}, {withCredentials:true});
              this.cartService.setNewItemStatus(true);
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
