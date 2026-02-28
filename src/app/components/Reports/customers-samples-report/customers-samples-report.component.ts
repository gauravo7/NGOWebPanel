import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PAGELENGTH } from 'src/app/endpoints';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { UserServiceService } from 'src/app/shared/service/userService/user-service.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgToggleModule } from 'ng-toggle-button';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ExcelService } from 'src/app/shared/service/excel/excel.service';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import { ActivatedRoute, RouterLink } from '@angular/router';


@Component({
  selector: 'app-customers-samples-report',
  imports: [
    CardComponent,
    MatTableModule,
    MatPaginatorModule,
    NgToggleModule,
    MatIcon,
    ReactiveFormsModule,
    NgSelectModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    DatePipe,
    MatLabel,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './customers-samples-report.component.html',
  styleUrl: './customers-samples-report.component.scss'
})
export class CustomersSamplesReportComponent {
  pageSize: any
  startpoint: number = 0;
  totalLoaded: number = 0;
  total: number = 0;
  pageNo: number = 0;
  allCategoriesMini: any;
  allWholesalers: any;
  allRetailers: any;
  allCompanies: any;
  debounceNameTimer: any = null;
  debounceBarCodeTimer: any = null;
  debounceCityStateTimer: any = null;

  sampleSearch: any = {
    name: '',
    cityState: '',
    issuerType: null,
    gender: null,
    receiverType: null,
    category: undefined,
    company: undefined,
    startdate: null,
    enddate: null,
    issuedByDistributorId1: null,
    issuedByDistributorId2: null,
    barCode: ''
  };
  samplesDataSource = new MatTableDataSource<any>([]);




  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.samplesDataSource.paginator = this.paginator;
  }
  constructor(
    private categoryService: CategoryService,
    private sampleService: SampleService,
    private userService: UserServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private companyService: CompanyService,
    public userDataService: UserDataService,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) {
    this.setDisplayedColumns();
  }


  isCompanyLoggedIn: boolean = false
  getCompanyData() {
    let userData = this.userDataService.getData()
    let companyData = userData.company
    if (!!companyData) {
      this.isCompanyLoggedIn = true
      this.sampleSearch.company = companyData._id
      this.getAllSamples(null)
    }
    else {
      this.isCompanyLoggedIn = false
      this.getAllSamples(null);
    }
  }

  isTodayCust: any = false;

  ngOnInit(): void {

    this.isTodayCust = this.activatedRoute.snapshot.queryParamMap.get("isTodayCust");

    const today = new Date();

    if (this.isTodayCust === 'true') {
      this.sampleSearch.startdate = today;
      this.sampleSearch.enddate = today;
    } else {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      this.sampleSearch.startdate = firstDayOfMonth;
      this.sampleSearch.enddate = today;
    }


    this.getAllCategoriesMini();
    this.allCompaniesMini();
    this.allCompanyWholesalersMini();
    this.allCompanyRetailersMini();
    this.getCompanyData();
    if (this.isCompanyLoggedIn === false) {
      this.customerSampleDisplayedColumns.splice(1, 0, 'company');
      this.customerSampleDisplayedColumns.splice(5, 0, 'customerPhone');
    }


  }
  customerSampleDisplayedColumns: string[] = [

  ];

  setDisplayedColumns(): void {

    this.customerSampleDisplayedColumns = [
      'srno',
      'sampleName',
      'barcode',
      'customerName',
      'gender',
      'age',
      'address',
      'issuedQuantity',
      'limit',
      'issueType',
      'distributorName',
      'holdType',
      'issuedAt'
    ];
  }

  issuedByOptions = [
    { label: 'Wholesaler', value: 1 },
    { label: 'Retailer', value: 2 }
  ];

  genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 },
    { label: 'Other', value: 3 }
  ];

  receiverTypeOptions = [
    { label: 'Wholesaler', value: 1 },
    { label: 'Retailer', value: 2 }
  ];

  getAllCategoriesMini(): void {
    this.categoryService.allCategoriesMini({}).subscribe({
      next: (res) => {
        if (res.success) this.allCategoriesMini = res.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }
  allCompaniesMini() {
    this.companyService.allCompaniesMini({}).subscribe({
      next: (result) => {
        if (result.success) this.allCompanies = result.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }

  allCompanyWholesalersMini() {
    this.userService.allCompanyDistributorMini({ distributorType: 1 }).subscribe({
      next: (result) => {
        if (result.success) this.allWholesalers = result.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }

  allCompanyRetailersMini() {
    this.userService.allCompanyDistributorMini({ distributorType: 2 }).subscribe({
      next: (result) => {
        if (result.success) this.allRetailers = result.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }


  onNameInputChange(event: any): void {
    clearTimeout(this.debounceNameTimer);
    this.debounceNameTimer = setTimeout(() => {
      const name = event.target.value.trim();
      this.sampleSearch.name = name || undefined;
      this.getAllSamples(null);
    }, 300);
  }
  onBarCodeInputChange(event: any): void {
    clearTimeout(this.debounceBarCodeTimer);
    this.debounceBarCodeTimer = setTimeout(() => {
      const code = event.target.value.trim();
      this.sampleSearch.barCode = code || undefined;
      this.getAllSamples(null);
    }, 300);
  }
  onCityStateInputChange(event: any): void {
    clearTimeout(this.debounceBarCodeTimer);
    this.debounceCityStateTimer = setTimeout(() => {
      const cityState = event.target.value.trim();
      this.sampleSearch.cityState = cityState || undefined;
      this.getAllSamples(null);
    }, 300);
  }
  clearDateRange(): void {
    this.sampleSearch.startdate = null;
    this.sampleSearch.enddate = null;
    this.getAllSamples(null);
  }


  calculateAge(dob: string | Date): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }




  getAllSamples(event: any) {
    this.spinner.show();

    // If there's no event (initial load or filter), reset values
    if (!event) {
      this.pageNo = 0;
      this.startpoint = 0;
      this.pageSize = this.pageSize || PAGELENGTH;
      this.samplesDataSource.data = [];
      this.totalLoaded = 0;
    }

    // If page size changed, reset pagination
    if (event?.pageSize && event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.pageNo = 0;
      this.startpoint = 0;
      this.samplesDataSource.data = [];
      this.totalLoaded = 0;
    }

    // Update page number and startpoint based on event
    if (event?.pageIndex !== undefined) {
      this.pageNo = event.pageIndex;
      this.startpoint = this.pageNo * (this.pageSize || PAGELENGTH);
    }

    // Prepare API data
    const data: any = {
      startpoint: this.startpoint,
      limit: this.pageSize || PAGELENGTH
    };

    // Apply filters

    if (!!this.sampleSearch.startdate && !!this.sampleSearch.enddate) {
      data.startdate = this.sampleSearch.startdate;
      data.enddate = this.sampleSearch.enddate;
    }
    if (this.sampleSearch.name) data.name = this.sampleSearch.name;
    if (this.sampleSearch.barCode) data.sampleCode = this.sampleSearch.barCode;
    if (this.sampleSearch.gender) data.gender = this.sampleSearch.gender;
    if (this.sampleSearch.category) data.categoryId = this.sampleSearch.category;
    if (this.sampleSearch.company) data.companyId = this.sampleSearch.company;

    if (this.sampleSearch.issuerType) data.issuerType = this.sampleSearch.issuerType;
    if (this.sampleSearch.receiverType) data.receiverType = this.sampleSearch.receiverType;
    if (this.sampleSearch.issuedByDistributorId1) data.issuedByDistributorId = this.sampleSearch.issuedByDistributorId1;
    if (this.sampleSearch.issuedByDistributorId2) data.issuedByDistributorId = this.sampleSearch.issuedByDistributorId2;
    if (this.sampleSearch.cityState) data.cityState = this.sampleSearch.cityState;

    this.sampleService.allIssuedSamplesToCustomer(data).subscribe({
      next: (result) => {
        this.spinner.hide();
        if (result.success) {
          this.total = result.total ?? 0;
          this.samplesDataSource.data = result.data || [];
          this.totalLoaded = this.samplesDataSource.data.length;

          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = this.pageNo;
              this.paginator.length = this.total;
              this.paginator.pageSize = this.pageSize ?? PAGELENGTH;
            }
          }, 0);
        }
      },
      error: (e) => {
        this.spinner.hide();
        const errorMsg = e.status === 0
          ? "Server not reachable. Try again later."
          : e.message || "An unexpected error occurred.";
        this.toastr.error(errorMsg, "Error");
      }
    });
  }

  getTruncatedAddress(address: string = '', wordLimit: number = 4): string {
    const words = address.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : address;
  }



  generateExcel() {
    if (this.isCompanyLoggedIn) {
      var header = [
        'Sr No', 'Company', 'Sample Name', 'Category', 'Bar Code', 'Customer Name',
        'Gender', 'Age', 'Address', 'Qty Issued', 'Limit',
        'Issued By', 'Distributor', 'By Hold ?', 'Issued On'
      ];
    }
    else {
      var header = [
        'Sr No', 'Company', 'Sample Name', 'Category', 'Bar Code', 'Customer Name',
        'Email', 'Phone', 'Gender', 'Age', 'Address', 'Qty Issued', 'Limit',
        'Issued By', 'Distributor', 'By Hold ?', 'Issued On'
      ];

    }

    let data: any = {};
    if (this.sampleSearch.name) data.name = this.sampleSearch.name || undefined;
    if (this.sampleSearch.barCode) data.sampleCode = this.sampleSearch.barCode || undefined;
    if (this.sampleSearch.category) data.categoryId = this.sampleSearch.category || undefined;
    if (this.sampleSearch.company) data.companyId = this.sampleSearch.company || undefined;
    if (this.sampleSearch.startdate) data.startdate = this.sampleSearch.startdate || undefined;
    if (this.sampleSearch.enddate) data.enddate = this.sampleSearch.enddate || undefined;
    if (this.sampleSearch.issuerType) data.issuerType = this.sampleSearch.issuerType || undefined;
    if (this.sampleSearch.receiverType) data.receiverType = this.sampleSearch.receiverType || undefined;
    if (this.sampleSearch.issuedByDistributorId1) data.issuedByDistributorId = this.sampleSearch.issuedByDistributorId1 || undefined;
    if (this.sampleSearch.issuedByDistributorId2) data.issuedByDistributorId = this.sampleSearch.issuedByDistributorId2 || undefined;
    if (this.sampleSearch.cityState) data.cityState = this.sampleSearch.cityState || undefined;



    const filterDisplayValues: { [key: string]: string } = {};

    if (this.sampleSearch.name) filterDisplayValues['Name'] = this.sampleSearch.name;

    if (this.sampleSearch.barCode) filterDisplayValues['Bar Code'] = this.sampleSearch.barCode;

    if (this.sampleSearch.category) {
      const selectedCategory = this.allCategoriesMini.find((category: any) => category._id == this.sampleSearch.category);
      if (selectedCategory) {

        filterDisplayValues['Category'] = selectedCategory.name
      }
    }

    if (this.sampleSearch.company) {
      const selectedCompany = this.allCompanies.find((company: any) => company._id == this.sampleSearch.company);
      if (selectedCompany) {
        filterDisplayValues['Company'] = selectedCompany.name
      }
    }


    if (this.sampleSearch.startdate || this.sampleSearch.enddate) {
      const start = this.sampleSearch.startdate.toISOString().split('T')[0];
      const end = this.sampleSearch.enddate.toISOString().split('T')[0];
      filterDisplayValues['Date Range'] = `${start} to ${end}`;
    }


    this.sampleService.allIssuedSamplesToCustomer(data).subscribe(
      (res: any) => {
        if (!res.success) {
          this.toastr.error(res.message);
          return;
        }
        const sampleRes = res.data || [];
        if (sampleRes.length === 0) {
          this.toastr.info("No data found to export.");
          return;
        }
        let title = `Customer Sample Assignment Summary`;
        let excelData: any[][] = [];

        if (this.isCompanyLoggedIn) {
          sampleRes.forEach((e: any, index: number) => {
            excelData.push([
              index + 1,
              e.companyId && e.companyId.name ? e.companyId.name : '-',
              e.sampleId && e.sampleId.name ? e.sampleId.name : '-',
              e.categoryId && e.categoryId.name ? e.categoryId.name : '-',
              e.sampleId && e.sampleId.sampleCode ? e.sampleId.sampleCode : '-',
              e.customerId && e.customerId.name ? e.customerId.name : '-',


              e.customerId && e.customerId.gender === 1
                ? 'Male'
                : e.customerId && e.customerId.gender === 2
                  ? 'Female'
                  : e.customerId && e.customerId.gender === 3
                    ? 'Other'
                    : '-',

              e.customerId && e.customerId.dob
                ? this.calculateAge(e.customerId.dob)
                : '-',

              [e.customerId?.address, e.customerId?.city, e.customerId?.state]
                .filter(val => val && val !== '')
                .join(',') || '-',

              e.issuedQuantity !== undefined && e.issuedQuantity !== null ? e.issuedQuantity : '-',
              e.sampleId && e.sampleId.maxIssueQuantityCustomer !== undefined && e.sampleId.maxIssueQuantityCustomer !== null
                ? e.sampleId.maxIssueQuantityCustomer
                : '-',

              e.issuerType === 1
                ? 'Wholesaler'
                : e.issuerType === 2
                  ? 'Retailer'
                  : 'Company',

              e.issuedByDistributorId && e.issuedByDistributorId.name
                ? e.issuedByDistributorId.name
                : '-',

              e.issueByHold ? 'Yes' : 'No',

              e.issuedAt
                ? e.issuedAt.split('T')[0]
                : '-',
            ]);
          });
        }
        else {
          sampleRes.forEach((e: any, index: number) => {
            excelData.push([
              index + 1,
              e.companyId && e.companyId.name ? e.companyId.name : '-',
              e.sampleId && e.sampleId.name ? e.sampleId.name : '-',
              e.categoryId && e.categoryId.name ? e.categoryId.name : '-',
              e.sampleId && e.sampleId.sampleCode ? e.sampleId.sampleCode : '-',
              e.customerId && e.customerId.name ? e.customerId.name : '-',
              e.customerId && e.customerId.email ? e.customerId.email : '-',
              e.customerId && e.customerId.phone ? e.customerId.phone : '-',
              e.customerId && e.customerId.gender === 1
                ? 'Male'
                : e.customerId && e.customerId.gender === 2
                  ? 'Female'
                  : e.customerId && e.customerId.gender === 3
                    ? 'Other'
                    : '-',

              e.customerId && e.customerId.dob
                ? this.calculateAge(e.customerId.dob)
                : '-',

              [e.customerId?.address, e.customerId?.city, e.customerId?.state]
                .filter(val => val && val !== '')
                .join(',') || '-',

              e.issuedQuantity !== undefined && e.issuedQuantity !== null ? e.issuedQuantity : '-',
              e.sampleId && e.sampleId.maxIssueQuantityCustomer !== undefined && e.sampleId.maxIssueQuantityCustomer !== null
                ? e.sampleId.maxIssueQuantityCustomer
                : '-',

              e.issuerType === 1
                ? 'Wholesaler'
                : e.issuerType === 2
                  ? 'Retailer'
                  : 'Company',

              e.issuedByDistributorId && e.issuedByDistributorId.name
                ? e.issuedByDistributorId.name
                : '-',

              e.issueByHold ? 'Yes' : 'No',

              e.issuedAt
                ? e.issuedAt.split('T')[0]
                : '-',
            ]);
          });
        }
        this.excelService.generateExcel(excelData, header, title, filterDisplayValues);
      },
      (error: any) => {
        console.error('Error in generateExcel:', error);
      }
    );
  }
}
