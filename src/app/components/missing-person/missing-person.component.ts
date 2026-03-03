import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormArray, FormsModule, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BASE_IMAGE_URL } from 'src/app/endpoints';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgToggleModule } from 'ng-toggle-button';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { SafeUrlPipe } from 'src/app/shared/pipe/safe_url/safe_url_pipe.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import JsBarcode from 'jsbarcode';
import { HasRoleDirective } from 'src/app/shared/directive/has-role.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

declare var bootstrap: any;

@Component({
  selector: 'app-missing-person',
  imports: [
    CardComponent,
    MatTableModule,
    MatPaginatorModule,
    NgToggleModule,
    MatIcon,
    ReactiveFormsModule,
    DatePipe,
    NgSelectModule,
    RouterLink,
    SafeUrlPipe,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatLabel,
    MatInputModule,
    CommonModule,
    HasRoleDirective,
    MatTooltipModule
  ],
  templateUrl: './missing-person.component.html',
  styleUrl: './missing-person.component.scss'
})
export class MissingPersonComponent {
  // Component variables
  sampleDetailModal: any;
  AssignSampleModal: any;
  addTreatmentModal: any;
  categoryChangeModal: any;
  wardChangeModal: any;

  genders: any = '';
  genderData = [
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 },
    { name: 'Others', id: 3 }
  ];
  homeData = [
    { name: 'Hospital', id: 2 },
    { name: 'Home', id: 1 }
  ];

  //// 1: Dealth /////  2: Family Reunite ///   3:Escape // 4:family Member

  closeType = [
    { name: 'No Closure', id: 0 },
    { name: 'Death', id: 1 },
    { name: 'Family Reunite', id: 2 },
    { name: 'Escape', id: 3 },
    { name: 'Family Member', id: 4 }
  ];

  displayedColumns = ['srno', 'photo', 'missingName', 'age', 'address', 'missingDate', 'status', 'reporter', 'createdAt'];

  dischargeModal: any;

  closeTypes = [
    { label: 'Death', value: 1 },
    { label: 'Family Reunite', value: 2 },
    { label: 'Escape', value: 3 },
    { label: 'NGO Family Member', value: 4 }
  ];

  startpoint: number = 0;
  search: any;
  totalLoaded: number = 0;
  total: any;
  pageNo: any;
  sampleId: any;
  name: any;
  pageSize: any;
  dataSource = new MatTableDataSource<any>([]);
  userData: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('barcodeElement') barcodeElement!: ElementRef;

  // Filter and category/company data
  sampleData: any;
  wholeSalerTotal: any;
  retailerTotal: any;
  allCategoriesMini: any;
  allCompanies: any;
  userType: any = '';

  // Reactive Form for assigning samples
  issueSampleForm = new FormGroup({
    rows: new FormArray([])
  });

  get rows() {
    return this.issueSampleForm.get('rows') as FormArray;
  }

  // Debounce handlers
  debounceNameTimer: any = null;
  debounceBarCodeTimer: any = null;

  // Sample search object
  sampleSearch: any = {
    name: '',
    barCode: '',
    category: undefined,
    company: undefined,
    startdate: null,
    enddate: null,
    gender: undefined,
    isHome: undefined,
    closeType: undefined
  };

  isCompanyLoggedIn: boolean = false;
  categoryId: any = '';

  constructor(
    private sampleService: SampleService,
    private categoryService: CategoryService,
    private companyService: CompanyService,
    public userDataService: UserDataService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private wardService: CompanyService
  ) {
    this.setDisplayedColumns();
  }

  // Configure displayed columns based on user role
  setDisplayedColumns(): void {
    // this.displayedColumns = ['srno', 'name', 'barcode', 'totalItems', 'leftItems', 'ageRange', 'status', 'createdAt', 'preview'];

    // if (this.userDataService.roleMatch(['SAMPLE-ASSIGN'])) {
    //   this.displayedColumns.push('assignSample');
    // }
    // if (this.userDataService.roleMatch(['SAMPLE-EDIT'])) {
    //   this.displayedColumns.push('action');
    // }
  }

  isTodaySample: any = false;
  ngOnInit(): void {
    this.isTodaySample = this.activatedRoute.snapshot.queryParamMap.get('isTodaySample');
    if (this.isTodaySample === 'true') {
      const today = new Date();
      this.sampleSearch.startdate = today;
      this.sampleSearch.enddate = today;
    }
    // this.getAllCategoriesMini();
    // this.allCompaniesMini();
    // this.getCompanyData();

    this.userData = this.userDataService.getData();

    if (this.userData) {
      this.userType = this.userData?.data?.userType;
      if (this.userType == 2) {
        this.sampleSearch.company = this.userData?.data?.assignedWard;
      }
    }

    this.getAllSamples(null);
    this.getAllCategories();
    this.fetchWards(undefined);
  }

  // Handle filter change
  sampleFilter(event: any): void {
    this.getAllSamples(null);
  }

  // Fetch all minimal categories
  getAllCategoriesMini(): void {
    this.categoryService.allCategoriesMini({}).subscribe({
      next: (res) => {
        if (res.success) this.allCategoriesMini = res.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }

  // Handle debounce for name input
  onNameInputChange(event: any): void {
    clearTimeout(this.debounceNameTimer);
    this.debounceNameTimer = setTimeout(() => {
      const name = event.target.value.trim();
      this.sampleSearch.name = name || undefined;
      this.getAllSamples(null);
    }, 300);
  }

  // Handle debounce for barcode input
  onBarCodeInputChange(event: any): void {
    clearTimeout(this.debounceBarCodeTimer);
    this.debounceBarCodeTimer = setTimeout(() => {
      const code = event.target.value.trim();
      this.sampleSearch.barCode = code || undefined;
      this.getAllSamples(null);
    }, 300);
  }

  // Clear selected date range
  clearDateRange(): void {
    this.sampleSearch.startdate = null;
    this.sampleSearch.enddate = null;
    this.getAllSamples(null);
  }

  // Check if user has a company linked and fetch data accordingly
  getCompanyData() {
    let userData: any = this.userDataService.getData();
    let companyData: any = userData.company;
    if (!!companyData) {
      this.isCompanyLoggedIn = true;
      this.sampleSearch.company = companyData._id;
      this.getAllSamples(null);
    } else {
      this.isCompanyLoggedIn = false;
      this.getAllSamples(null);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    const sampleDetailModalElement = document.getElementById('sampleDetailModal');
    if (sampleDetailModalElement) {
      this.sampleDetailModal = new bootstrap.Modal(sampleDetailModalElement);
    }

    ///
    const addTreatmentModal = document.getElementById('addTreatmentModal');
    if (addTreatmentModal) {
      this.addTreatmentModal = new bootstrap.Modal(addTreatmentModal);
    }

    //
    const categoryChangeModal = document.getElementById('categoryChangeModal');
    if (categoryChangeModal) {
      this.categoryChangeModal = new bootstrap.Modal(categoryChangeModal);
    }

    //
    const wardChangeModal = document.getElementById('wardChangeModal');
    if (wardChangeModal) {
      this.wardChangeModal = new bootstrap.Modal(wardChangeModal);
    }

    const closePersonModal = document.getElementById('closePersonModal');
    if (wardChangeModal) {
      this.dischargeModal = new bootstrap.Modal(closePersonModal);
    }
  }

  // Generate barcode using JsBarcode
  getSampleCode(sampleCode: any) {
    if (this.barcodeElement?.nativeElement && sampleCode) {
      JsBarcode(this.barcodeElement.nativeElement, sampleCode, {
        format: 'CODE128',
        lineColor: '#000000',
        background: '#ffffff',
        width: 1.5,
        height: 40,
        fontSize: 12,
        displayValue: true
      });
    } else {
      console.warn('Barcode element or sample code missing');
    }
  }

  // Generate full image path from base
  getImg(imgPath: any) {
    return BASE_IMAGE_URL + imgPath;
  }

  // Fetch all companies
  allCompaniesMini() {
    this.companyService.allCompaniesMini({}).subscribe({
      next: (result) => {
        if (result.success) this.allCompanies = result.data;
      },
      error: (e) => this.toastr.error(e)
    });
  }

  // Open modal to view sample details
  openModel(sampleId: any) {
    this.sampleId = sampleId;
    if (sampleId !== null) this.getSingleSample(sampleId);
    this.sampleDetailModal.show();
  }

  openModalAddTreatment(personId: any) {
    this.sampleId = personId;
    this.addTreatmentModal.show();
  }

  openModalAddCategoryChange(personId: any, categoryId: any) {
    this.categoryId = categoryId;
    this.addCategory.patchValue({ categoryId: categoryId });
    this.sampleId = personId;
    this.categoryChangeModal.show();
  }

  openModalAddWardChange(personId: any, wardId: any) {
    this.addWard.patchValue({ wardId: wardId });
    this.sampleId = personId;
    this.wardChangeModal.show();
  }

  openModalAddDischarge(personId: any) {
    this.sampleId = personId;
    this.dischargeModal.show();
  }

  // Hide sample details modal
  hideModel() {
    this.sampleDetailModal.hide();
  }

  hideAddTreatment() {
    this.addTreatmentModal.hide();
  }

  hideCategoryChange() {
    this.categoryChangeModal.hide();
  }

  hideWardChange() {
    this.wardChangeModal.hide();
  }

  // Fetch single sample data by ID
  getSingleSample(sampleId: any) {
    this.spinner.show();
    this.sampleService.singleSample({ _id: sampleId }).subscribe({
      next: (v: any) => {
        if (v.success) this.sampleData = v.data;
        else console.log(v.message);
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      },
      complete: () => this.spinner.hide()
    });
  }

  // Fetch all samples with current filters and pagination
  getAllSamples(event: any) {
    this.spinner.show();
    if (!event) {
      this.pageNo = 0;
      this.startpoint = 0;
      this.pageSize = this.pageSize || 10;
      this.dataSource.data = [];
    }
    if (event?.pageSize && event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.pageNo = 0;
      this.startpoint = 0;
      this.dataSource.data = [];
    }
    if (event?.pageIndex !== undefined) {
      this.pageNo = event.pageIndex;
      this.startpoint = this.pageNo * (this.pageSize || 10);
    }

    const data: any = {
      startpoint: this.startpoint,
      limit: this.pageSize,
      search: this.sampleSearch.name || undefined,
      categoryId: this.sampleSearch.category || undefined,
      startdate: this.sampleSearch.startdate || undefined,
      enddate: this.sampleSearch.enddate || undefined,
      wardId: this.sampleSearch.company || undefined,
      gender: this.sampleSearch.gender || undefined,
      isHome: this.sampleSearch.isHome || undefined,
      closeType: this.sampleSearch.closeType || undefined
    };
    if (data.isHome === 1) {
      this.fetchWards('Home');
    } else if (data.isHome === 2) {
      this.fetchWards('Hospital');
    } else {
      this.fetchWards(undefined);
    }

    this.sampleService.allMembers(data).subscribe({
      next: (result) => {
        if (result?.success) {
          this.total = result.total ?? 0;
          this.dataSource.data = result.data || [];
          setTimeout(() => {
            if (this.paginator) {
              this.paginator.pageIndex = this.pageNo;
              this.paginator.length = this.total;
              this.paginator.pageSize = this.pageSize;
            }
          }, 0);
        }
      },
      error: (error: any) => {
        let errorMsg = 'An unexpected error occurred.';
        if (error.status === 0) {
          errorMsg = 'Server not reachable. Please check your network connection.';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.toastr.error(errorMsg, 'Error');
        console.error('Sample Fetch Error:', error);
      },
      complete: () => this.spinner.hide()
    });
  }

  // Toggle sample status (blocked/unblocked) with confirmation
  sampleStatus(element: any) {
    const currentStatus = element.isBlocked;
    const newStatus = !currentStatus;
    const action = newStatus ? 'Block' : 'Unblock';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: `${action} this Sample?`,
        text: `This will ${action.toLowerCase()} the Sample.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `${action}`,
        cancelButtonText: 'Cancel',
        reverseButtons: true
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.sampleService.enableDisableSample({ _id: element._id, isBlocked: newStatus }).subscribe({
            next: (v: any) => {
              if (v.success) {
                element.isBlocked = newStatus;
                this.toastr.success(`Sample ${action.toLowerCase()}ed successfully.`);
              } else {
                this.toastr.error(v.message, 'Error');
              }
            },
            error: (e: any) => {
              this.toastr.error(e.message, 'Error');
            }
          });
        }
      });
    return false;
  }

  submitAddTreatment() {
    let data: any = {};
    data.remarks = this.addTreatment.value.remarks ?? '';
    if (this.sampleId) {
      data.personId = this.sampleId;
    }

    this.spinner.show();

    this.sampleService.addTreatment(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.hideAddTreatment();
          this.toastr.success(res.message, 'Success');
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  addTreatment = new FormGroup({
    remarks: new FormControl('', [Validators.required])
  });

  addCategory = new FormGroup({
    remarks: new FormControl('', [Validators.required]),
    _id: new FormControl(''),
    categoryId: new FormControl('', [Validators.required])
  });

  addWard = new FormGroup({
    remarks: new FormControl('', [Validators.required]),
    _id: new FormControl(''),
    wardId: new FormControl('', [Validators.required])
  });

  submitCategoryChange() {
    let data: any = this.addCategory.value;

    if (this.sampleId) {
      data._id = this.sampleId;
    }
    this.spinner.show();

    this.sampleService.addCategoryLogs(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.hideCategoryChange();
          this.toastr.success(res.message, 'Success');
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  submitWardChange() {
    let data: any = this.addWard.value;

    if (this.sampleId) {
      data._id = this.sampleId;
    }
    this.spinner.show();

    this.sampleService.addWardLogs(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.hideWardChange();
          this.toastr.success(res.message, 'Success');
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  addDischarge = new FormGroup({
    remarks: new FormControl('')
  });

  // Category dropdown data
  categories: any[] = [];

  wardData: any = [];

  // Fetch all unblocked categories
  getAllCategories() {
    this.categoryService.allCategories({ isBlocked: false }).subscribe({
      next: (result) => {
        if (result.success) {
          this.categories = result.data;
        }
      },
      error: (e) => {
        this.toastr.error(e);
      }
    });
  }

  fetchWards(type: any) {
    this.wardService.allCompanies({ type: type }).subscribe({
      next: (result) => {
        this.spinner.hide();
        if (result.success) {
          this.wardData = result.data;
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      }
    });
  }

  closeForm: any = new FormGroup({
    closeType: new FormControl(null, Validators.required),
    remarks: new FormControl('', Validators.required),

    wardId: new FormControl(null),

    fname: new FormControl(''),
    fphone: new FormControl(''),
    fanotherPhone: new FormControl(''),
    froofType: new FormControl(''),
    famproofNo: new FormControl(''),
    faddress: new FormControl('')
  });

  handleCloseTypeChanges() {
    this.closeForm.get('closeType')?.valueChanges.subscribe((value: any) => {
      // Reset all dynamic validators
      this.closeForm.get('wardId')?.clearValidators();
      this.clearFamilyValidators();

      if (value == 4) {
        this.closeForm.get('wardId')?.setValidators(Validators.required);
      }

      if (value == 2) {
        this.setFamilyValidators();
      }

      this.closeForm.get('wardId')?.updateValueAndValidity();
      this.updateFamilyValidity();
    });
  }

  setFamilyValidators() {
    // this.closeForm.get('fname')?.setValidators(Validators.required);
    // this.closeForm.get('fphone')?.setValidators(Validators.required);
    // this.closeForm.get('fproofType')?.setValidators(Validators.required);
    // this.closeForm.get('fproofNo')?.setValidators(Validators.required);
    // this.closeForm.get('faddress')?.setValidators(Validators.required);
  }

  clearFamilyValidators() {
    const fields = ['fname', 'fphone', 'fanotherPhone', 'fproofType', 'fproofNo', 'faddress'];

    fields.forEach((field) => {
      this.closeForm.get(field)?.clearValidators();
    });
  }

  updateFamilyValidity() {
    const fields = ['fname', 'fphone', 'fanotherPhone', 'fproofType', 'fproofNo', 'faddress'];

    fields.forEach((field) => {
      this.closeForm.get(field)?.updateValueAndValidity();
    });
  }

  submitCloseForm() {
    let data: any = this.closeForm.value;

    if (this.sampleId) {
      data.personId = this.sampleId;
    }
    this.spinner.show();
    this.sampleService.addDischage(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.hideCloseModal();
          this.toastr.success(res.message, 'Success');
        } else {
          this.toastr.error(res.message, 'Error');
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  hideCloseModal() {
    this.dischargeModal.hide();
  }

  isCategoryDisabled = (item: any) => {
    return item._id === this.categoryId;
  };
}
