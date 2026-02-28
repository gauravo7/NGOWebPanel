import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgToggleModule } from 'ng-toggle-button';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PAGELENGTH } from 'src/app/endpoints';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { ExcelService } from 'src/app/shared/service/excel/excel.service';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import { UserServiceService } from 'src/app/shared/service/userService/user-service.service';

@Component({
  selector: 'app-distributor-samples-report',
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
    RouterLink
  ],
  templateUrl: './distributor-samples-report.component.html',
  styleUrl: './distributor-samples-report.component.scss'
})
export class DistributorSamplesReportComponent {

  startpoint: number = 0;
  totalLoaded: number = 0;
  total: number = 0;
  pageNo: number = 0;
  allCategoriesMini: any;
  allDistributors: any;
  allCompanies: any;
  debounceNameTimer: any = null;
  debounceBarCodeTimer: any = null;
  debounceCityStateTimer: any = null;
  pageSize: any

  sampleSearch: any = {
    name: '',
    cityState: '',
    issueType: null,
    receiverType: null,
    category: undefined,
    company: undefined,
    startdate: null,
    enddate: null,
    receiverDistributorId: null,
    issuerDistributorId: null,
    barCode: ''
  };
  samplesDataSource = new MatTableDataSource<any>([]);

  sampleDisplayedColumns: string[] = [
    'srno',
    'companyName',
    'name',
    'sampleCode',
    'issueType',
    'receiverName',
    'receiverType',
    'quantityAssigned',
    'quantityRemaining',
    'distributorLimit',
    'address',
    'createdAt',
  ];

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
    private excelService: ExcelService
  ) { }


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



  ngOnInit(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.sampleSearch.startdate = firstDayOfMonth;
    this.sampleSearch.enddate = today;
    this.getAllCategoriesMini();
    this.allCompaniesMini();
    this.allCompanyDistributorsMini();
    this.getCompanyData();
  }

  issuedByOptions = [
    { label: 'Company', value: 0 },
    { label: 'Wholesaler', value: 1 }
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

  allCompanyDistributorsMini() {
    let userData = this.userDataService.getData()
    if (userData) {
      let company = userData.company
      if (company) {
        var companyId = company._id
      }
      else {
        var companyId = undefined
      }
    }
    this.userService.allCompanyDistributorMini({ companyId: companyId }).subscribe({
      next: (result) => {
        if (result.success) this.allDistributors = result.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }

  onNameInputChange(event: any): void {
    clearTimeout(this.debounceNameTimer);
    this.debounceNameTimer = setTimeout(() => {
      const name = event.target.value;
      this.sampleSearch.name = name || undefined;
      this.getAllSamples(null);
    }, 300);
  }
  onBarCodeInputChange(event: any): void {
    clearTimeout(this.debounceBarCodeTimer);
    this.debounceBarCodeTimer = setTimeout(() => {
      const code = event.target.value;
      this.sampleSearch.barCode = code || undefined;
      this.getAllSamples(null);
    }, 300);
  }
  onCityStateInputChange(event: any): void {
    clearTimeout(this.debounceBarCodeTimer);
    this.debounceCityStateTimer = setTimeout(() => {
      const cityState = event.target.value;
      this.sampleSearch.cityState = cityState || undefined;
      this.getAllSamples(null);
    }, 300);
  }
  clearDateRange(): void {
    this.sampleSearch.startdate = null;
    this.sampleSearch.enddate = null;
    this.getAllSamples(null);
  }

  getAllSamples(event: any) {

    this.spinner.show();

    // Reset values if first load or filters applied
    if (!event) {
      this.pageNo = 0;
      this.startpoint = 0;
      this.pageSize = this.pageSize || PAGELENGTH;
      this.samplesDataSource.data = [];
    }

    // Handle page size change
    if (event?.pageSize && event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.pageNo = 0;
      this.startpoint = 0;
      this.samplesDataSource.data = [];
    }

    // Handle page index change
    if (event?.pageIndex !== undefined) {
      this.pageNo = event.pageIndex;
      this.startpoint = this.pageNo * (this.pageSize || PAGELENGTH);
    }

    const data: any = {
      startpoint: this.startpoint,
      limit: this.pageSize || PAGELENGTH
    };

    // Apply filters
    const s = this.sampleSearch;
    if (!!s.startdate && !!s.enddate) {
      data.startdate = s.startdate;
      data.enddate = s.enddate;
    }
    if (s.name) data.name = s.name;
    if (s.barCode) data.sampleCode = s.barCode;
    if (s.category) data.categoryId = s.category;
    if (s.company) data.companyId = s.company;

    if (s.issueType) data.issueType = s.issueType;
    if (s.receiverType) data.receiverType = s.receiverType;
    if (s.receiverDistributorId) data.receiverDistributorId = s.receiverDistributorId;
    if (s.issuerDistributorId) data.issuerDistributorId = s.issuerDistributorId;
    if (s.cityState) data.cityState = s.cityState;

    this.sampleService.allIssuedSamplesDistributorTransaction(data).subscribe({
      next: (result) => {
        this.spinner.hide();
        if (result.success) {
          this.total = result.total ?? 0;
          this.samplesDataSource.data = result.data || [];

          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = this.pageNo;
              this.paginator.length = this.total;
              this.paginator.pageSize = this.pageSize ?? PAGELENGTH;
            }
          }, 0);
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        const errorMsg =
          e.status === 0
            ? "Server not reachable. Try again later."
            : e.message || "An unexpected error occurred.";
        this.toastr.error(errorMsg, "Error");
      }
    });
  }




  generateExcel() {
    const header = [
      'Sr No', 'Company', 'Sample Name', 'Category', 'Bar Code', 'Issued By',
      'Receiver', 'Receiver Type', 'Assigned', 'Remaining', 'Limit', 'City / State', 'Issued Date'
    ];
    let data: any = {};
    if (this.sampleSearch.name) data.name = this.sampleSearch.name || undefined;
    if (this.sampleSearch.barCode) data.sampleCode = this.sampleSearch.barCode || undefined;
    if (this.sampleSearch.category) data.categoryId = this.sampleSearch.category || undefined;
    if (this.sampleSearch.company) data.companyId = this.sampleSearch.company || undefined;
    if (this.sampleSearch.startdate) data.startdate = this.sampleSearch.startdate || undefined;
    if (this.sampleSearch.enddate) data.enddate = this.sampleSearch.enddate || undefined;

    if (this.sampleSearch.issueType) data.issueType = this.sampleSearch.issueType || undefined;
    if (this.sampleSearch.receiverType) data.receiverType = this.sampleSearch.receiverType || undefined;

    if (this.sampleSearch.receiverDistributorId) data.receiverDistributorId = this.sampleSearch.receiverDistributorId || undefined;
    if (this.sampleSearch.issuerDistributorId) data.issuerDistributorId = this.sampleSearch.issuerDistributorId || undefined;

    if (this.sampleSearch.cityState) data.cityState = this.sampleSearch.cityState || undefined;



    const filterDisplayValues: { [key: string]: string } = {};

    if (this.sampleSearch.name) filterDisplayValues['Sample Name'] = this.sampleSearch.name;



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


    if (this.sampleSearch.issueType) filterDisplayValues['Issued By'] = this.sampleSearch.issueType;


    if (this.sampleSearch.receiverType) filterDisplayValues['Receiver Type'] = this.sampleSearch.receiverType;


    if (this.sampleSearch.receiverDistributorId) {
      const selectedDistributor = this.allDistributors.find((d: any) => d._id == this.sampleSearch.receiverDistributorId);
      if (selectedDistributor) {
        filterDisplayValues['Received By'] = selectedDistributor.name
      }
    }

    if (this.sampleSearch.issuerDistributorId) {
      const selectedDistributor = this.allDistributors.find((d: any) => d._id == this.sampleSearch.issuerDistributorId);
      if (selectedDistributor) {
        filterDisplayValues['Issued By'] = selectedDistributor.name
      }
    }

    if (this.sampleSearch.cityState) filterDisplayValues['City / State'] = this.sampleSearch.cityState;




    this.sampleService.allIssuedSamplesDistributorTransaction(data).subscribe(
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
        let title = `Sample Issued From & To`;
        let excelData: any[][] = [];
        sampleRes.forEach((e: any, index: number) => {
          const excelRow: any[] = [];
          excelRow.push(index + 1);

          excelRow.push(e.companyId?.name || '-');

          excelRow.push(e.sampleId?.name || '-');

          excelRow.push(e.categoryId?.name || '-');

          excelRow.push(e.sampleId?.sampleCode || '-');

          let issuer = '-';
          if (e.issueType === 0) {
            issuer = 'Company';
          } else if (e.issueType === 1) {
            issuer = `Wholesaler`;
          } else if (e.issueType === 2) {
            issuer = `Retailer`;
          }
          excelRow.push(issuer);


          excelRow.push(e.receiverDistributorId?.name || '-');
          let receiver = '-';
          if (e.receiverType === 1) {
            receiver = 'Wholesaler';
          } else if (e.receiverType === 2) {
            receiver = 'Retailer';
          }
          excelRow.push(receiver);




          excelRow.push(e.quantityAssigned || '-');
          excelRow.push(e.quantityRemaining || '-');
          excelRow.push(e.distributorLimit || '-');


          const fullAddress = [e.address, e.city, e.state]
            .filter(val => val && val !== '')
            .join(',') || '-';
          excelRow.push(fullAddress);


          excelRow.push(e.createdAt ? e.createdAt.split('T')[0] : '-');


          excelData.push(excelRow);

        });
        this.excelService.generateExcel(excelData, header, title, filterDisplayValues);
      },
      (error: any) => {
        console.error('Error in generateExcel:', error);
      }
    );
  }


}
