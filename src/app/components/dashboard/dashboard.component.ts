import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardService } from 'src/app/shared/service/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule, MatDateRangeInput } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgToggleModule } from 'ng-toggle-button';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { NgxSpinnerService } from 'ngx-spinner';
import {  RouterLink,Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatLabel,
    MatInputModule,
    CardComponent,
    MatTableModule,
    MatPaginatorModule,
    NgToggleModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIcon,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // =============================
  // 🔹 All Variables on Top
  // =============================
  userData: any;
  userType: any;
  companyId: any;

  dashboardData: any;
  companyDashboardData: any;

  startdate: any;
  enddate: any;
  startpoint = 0;

  displayedColumns: string[] = [];
  recentDistributorsDisplayedColumns: string[] = [];
  recentSamplesDisplayedColumns: string[] = [];

  dataSource = new MatTableDataSource<any>([]);
  recentDistributorsDataSource = new MatTableDataSource<any>([]);
  recentSamplesDataSource = new MatTableDataSource<any>([]);

  issuedTodayToWHL = 0;
  issuedTodayToRTL = 0;

  // =============================
  // 🔹 Constructor
  // =============================
  constructor(
    private dashboardService: DashboardService,
    private userDataService: UserDataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router:Router
  ) {
    this.setDisplayedColumns();
    this.setRecentDistributorsDisplayedColumns();
    this.setrecentSamplesDisplayedColumns();
  }

  // =============================
  // 🔹 Lifecycle Hook
  // =============================
  ngOnInit() {
    this.userData = this.userDataService.getData();

    if (this.userData) {
      this.userType = this.userData?.data?.userType;
    }
    this.getDashboard();
  }

  // =============================
  // 🔹 Column Setup Methods
  // =============================
  setDisplayedColumns(): void {
    this.displayedColumns = [
      'position', 'name', 'barcode', 'whlLimit', 'rtlLimit', 'cusLimit',
      'whlIssued', 'rtlIssued', 'cusIssued', 'whlHold', 'rtlHold',
      'totalItems', 'assignedItems', 'stock'
    ];
  }

  setRecentDistributorsDisplayedColumns(): void {
    this.recentDistributorsDisplayedColumns = [
      'position', 'name', 'email', 'phone', 'city'
    ];
  }

  setrecentSamplesDisplayedColumns(): void {
    this.recentSamplesDisplayedColumns = [
      'position', 'name', 'barcode', 'total', 'category', 'company'
    ];
  }

  // =============================
  // 🔹 Utility Methods
  // =============================
  clearDateRange(): void {
    this.startdate = null;
    this.enddate = null;
    this.companyDashboard(null);
  }

  // =============================
  // 🔹 API Methods
  // =============================
  getDashboard(): void {
    this.dashboardService.adminDashboard({}).subscribe({
      next: (result) => {
        if (result.success) {
          this.dashboardData = result;
          console.log(result);

          this.recentDistributorsDataSource.data = [
            ...this.recentDistributorsDataSource.data,
            ...(this.dashboardData.recentDistributors || [])
          ];

          this.recentSamplesDataSource.data = [
            ...this.recentSamplesDataSource.data,
            ...(this.dashboardData.recentSamples || [])
          ];
        }
      },
      error: (e) => {
        this.toastr.error(e);
      }
    });
  }

  companyDashboard(event: any): void {
    this.spinner.show();
    this.dataSource.data = [];

    if (!event) {
      this.startpoint = 0;
      this.dataSource.data = [];
    }

    const data = this.userDataService.getData();

    this.dashboardService.companyDashboard({
      companyId: data.company._id,
      startdate: this.startdate || undefined,
      enddate: this.enddate || undefined
    }).subscribe({
      next: (result) => {
        if (result.success) {
          this.spinner.hide();
          this.companyDashboardData = result.data;
          this.issuedTodayToWHL = 0;
          this.issuedTodayToRTL = 0;
          for(let i=0;i<this.companyDashboardData?.issuedTodayDis.length;i++){
            const itr = this.companyDashboardData?.issuedTodayDis[i];
            if(itr) {
              this.issuedTodayToWHL += (itr?.totalIssuedToWHL??0);
              this.issuedTodayToRTL += (itr?.totalIssuedToRTL??0);
            }
          }

          this.dataSource.data = [
            ...this.dataSource.data,
            ...(this.companyDashboardData.recentSamples || [])
          ];
        }
      },
      error: (e) => {
        this.spinner.hide();
        this.toastr.error(e);
      }
    });
  }


  conditionalRouting(route:any){
    if(this.userType==1) {
      this.router.navigate([route]);
    }
  }


}
