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
import {CurrencyPipe, DatePipe} from "@angular/common";

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
    MatCardAvatar
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  apiUrl: string = 'http://localhost:3000';
  //todo
  profile = {
    firstName: '',
    lastName: '',
    email: ''
  };
  invoices: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getProfileData();
   // this.getInvoices();
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
    axios.get('https://your-backend.com/api/invoices')
      .then(response => {
        this.invoices = response.data;
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
      });
  }
}
