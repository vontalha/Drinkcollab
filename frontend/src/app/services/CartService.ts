import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private newItem$ = new BehaviorSubject<boolean>(false);
  private cartUrl = 'http://localhost:3000/cart';
  private orderUrl = 'http://localhost:3000/order';
  private cartId: string = '';
  constructor() {
  }

  getNewItemStatus(): Observable<boolean>{
    return this.newItem$.asObservable();
  }
  setNewItemStatus(newStatus: boolean){
    this.newItem$.next(newStatus);
  }

  async getCart(userId: string){
     return axios.get(this.cartUrl +'/'+ userId, {withCredentials:true}).then((response)=>{
       this.cartId = response.data.id;
       return response.data;
     }).catch( error => {
       //console.log(error);
     });
  }

  addToCart(userID: string, item: string) {
    axios.post(this.cartUrl+ '/' + userID +'/add', {productId: item, quantity: 1}, {withCredentials:true}).then((response) => {
      this.newItem$.next(true);
    }).catch((error) => {
      console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
    });
  }

  incrementItem(userID: string, item: string) {
    axios.post(this.cartUrl+ '/' + userID +'/update', {productId: item, quantity: 1, cartId: this.cartId, action:'increment'}, {withCredentials:true}).then((response) => {
      this.newItem$.next(true);
    }).catch((error) => {
      console.error('Fehler beim Erhöhen der Menge:', error);
    });
  }

  decrementItem(userID: string, item: string) {
    axios.post(this.cartUrl+ '/' + userID +'/update', {productId: item, quantity: 1, cartId: this.cartId, action:'decrement'}, {withCredentials:true}).then((response) => {
      this.newItem$.next(true);
    }).catch((error) => {
      console.error('Fehler beim Verringern der Menge:', error);
    });
  }

  removeItem(userID: string, item: string) {
    axios.post(this.cartUrl+ '/' + userID +'/remove', {productId: item},{withCredentials:true}).then((response) => {
      this.newItem$.next(true);
    }).catch((error) => {
      console.error('Fehler beim Entfernen des Items:', error);
    });
  }

  createInvoice(userID: string){
    axios.post(this.orderUrl+ '/create',{userId: userID, cartId: this.cartId, paymentMethod: 'INVOICE'},{withCredentials:true}).then((response)=>{
      console.log(response.data);
    }).catch((error) => {
      console.error('Fehler beim Erstellen der Invoice:', error);
    });
  }

}
