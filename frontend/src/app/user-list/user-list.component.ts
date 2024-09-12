import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import axios from "axios";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {DatePipe} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSort, MatSortHeader} from "@angular/material/sort";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatTable,
    MatFormField,
    MatPaginator,
    DatePipe,
    MatLabel,
    MatInput,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatSortHeader,
    MatSort
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{
  displayedColumns: string[] = [ 'firstName', 'lastName', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      const response = await axios.get('http://localhost:3000/admin/users', { withCredentials: true });
      this.dataSource.data = response.data.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data, filter) => {
        const dataStr = Object.values(data).reduce((acc, value) => {
          return acc + (value ? value.toString().toLowerCase() : '');
        }, '');
        // @ts-ignore
        return dataStr.includes(filter.trim().toLowerCase());
      };
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await axios.delete(`http://localhost:3000/admin/user/delete/${userId}`, {withCredentials:true});
      if(response){
        this.dataSource.data = this.dataSource.data.filter(user => user.id !== userId);
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers!', error);
      throw error;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
