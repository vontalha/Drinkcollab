import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

export interface DataItem {
  id: number;
  email: string;
}

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
    MatSort,
    MatProgressSpinner,
    NgIf,
    AsyncPipe,
    MatSortHeader
  ],
  templateUrl: './new-user-list.component.html',
  styleUrl: './new-user-list.component.css'
})
export class NewUserListComponent implements OnInit{
  displayedColumns: string[] = ['id'];
  dataSource = new MatTableDataSource<any>();
  // @ts-ignore
  isAuthorized$: Observable<boolean>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private auth: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getRequests();
    this.isAuthorized$ = this.auth.isAuthorized$();

    this.isAuthorized$.subscribe(()=>{
      this.cd.detectChanges();
    })
  }

  async getRequests() {
    try {
      const response = await axios.get('http://localhost:3000/admin/requests', {withCredentials:true});
      console.log(response.data);
      this.dataSource.data = response.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  }

  async approveUser(userId: string) {
    try {
      const response = await axios.post(`http://localhost:3000/admin/user/delete/${userId}`,{},{withCredentials:true});
      if(response){
        console.log("Approved User: ", userId);
      }
    } catch (error) {
      console.error('Fehler beim Freigeben des Benutzers!', error);
      throw error;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
