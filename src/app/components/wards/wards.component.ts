import { Component } from '@angular/core';

import {  ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import Swal from 'sweetalert2'
import { BASE_IMAGE_URL, PAGELENGTH } from 'src/app/endpoints';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import { RouterLink } from '@angular/router';
import { SHARED_IMPORTS } from 'src/app/shared-imports';
declare var bootstrap: any;
import { MatTableDataSource } from '@angular/material/table';
import { HasRoleDirective } from 'src/app/shared/directive/has-role.directive';
import { MatPaginator } from '@angular/material/paginator';
import { CompanyService } from 'src/app/shared/service/company/company.service';

@Component({
  selector: 'app-wards',
  imports: [
    SHARED_IMPORTS,
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    HasRoleDirective,
  ],
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.scss'
})
export class WardsComponent {

    genders:any = [{_id:'Hospital',name:"Hospital"},{_id:"Home",name:"Home"}];

    // =============================
    // 🔹 All Variables on Top
    // =============================
    formType: string = 'Add';
    categoryModal: any;
    startpoint = 0;
    search: any;
    totalLoaded = 0;
    total = 0;
    pageNo = 0;
    categoryRes: any;
    categoryId: any;
    pageSize: number = 10;
    name: any;
    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<any>([]);
    isCompanyLoggedIn: boolean = false;
    debounceTimer: any = null;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('fileInput') fileInput!: ElementRef;

    categoryForm = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      category_image: new FormControl('', [Validators.required]),
      location:new FormControl(''),
      gender: new FormControl(1), // 1 Male // 2: Female
      description: new FormControl('')
    });

    // =============================
    // 🔹 Constructor
    // =============================
    constructor(
      private wardService: CompanyService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      public userDataService: UserDataService
    ) {
      this.setDisplayedColumns();
    }

    // =============================
    // 🔹 Lifecycle Hooks
    // =============================
    ngOnInit(): void {
      this.getCompanyData();
    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      const modalElement = document.getElementById('categoryModal');
      if (modalElement) {
        this.categoryModal = new bootstrap.Modal(modalElement);
      }
    }

    // =============================
    // 🔹 Column Setup
    // =============================
    setDisplayedColumns(): void {
      this.displayedColumns = [
        'position', 'name','autoId','image', 'createdAt', 'updatedAt'
      ];
      if (this.userDataService.roleMatch(['CATEGORY-DELETE'])) {
        this.displayedColumns.push('isBlocked');
      }
      if (this.userDataService.roleMatch(['CATEGORY-EDIT'])) {
        this.displayedColumns.push('action');
      }
    }

    // =============================
    // 🔹 Utility Methods
    // =============================
    onSearchChange(event: any) {
      const value = event.target.value.trim();
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.name = value || undefined;
        this.getAllCategories(null);
      }, 200);
    }

    getImg(imgPath: any) {
      return BASE_IMAGE_URL + imgPath;
    }

    clearForm() {
      this.categoryForm.reset();
      if (this.fileInput) this.fileInput.nativeElement.value = '';
    }

    // =============================
    // 🔹 Modal Logic
    // =============================
    openModel(type: string, categoryId: any) {
      this.formType = type;
      this.categoryId = categoryId;

      if (categoryId !== null) {
        this.spinner.show();
        this.wardService.singleCompany({ _id: categoryId }).subscribe({
          next: (v: any) => {
            this.spinner.hide();
            if (v.success) {
              this.categoryForm.patchValue({
                name: v.data?.name,
                category_image: v.data?.image,
              });
            } else {
              this.toastr.error(v.message);
            }
          },
          error: (e: any) => {
            this.spinner.hide();
            this.toastr.error(e.message, 'Error');
          },
        });
      }
      this.categoryModal.show();
    }

    hideModel() {
      this.clearForm();
      this.categoryModal.hide();
    }

   uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // File type validation
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
      this.toastr.info("Only JPG, JPEG and PNG images are allowed.");
      event.target.value = "";
      return;
    }

    // Check aspect ratio
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      this.categoryForm.patchValue({ category_image: file });

      // const aspectRatio = img.width / img.height;
      // if (Math.abs(aspectRatio - 16 / 9) < 0.01) {   // 16:9 ratio (allowing small tolerance)
      // } else {
      //   this.toastr.error("Image aspect ratio must be 16:9.");
      //   event.target.value = "";
      // }
    };
  }




    // =============================
    // 🔹 Company Data Check
    // =============================
    getCompanyData() {
      const userData = this.userDataService.getData();
      const companyData = userData.company;
      this.isCompanyLoggedIn = !!companyData;
      this.getAllCategories(null);
    }

    // =============================
    // 🔹 Category Fetch
    // =============================
    getAllCategories(event: any) {
      this.spinner.show();

      if (!event) {
        this.pageNo = 0;
        this.startpoint = 0;
        this.pageSize = this.pageSize || PAGELENGTH;
        this.dataSource.data = [];
        this.totalLoaded = 0;
      }

      if (event?.pageSize && event.pageSize !== this.pageSize) {
        this.pageSize = event.pageSize;
        this.pageNo = 0;
        this.startpoint = 0;
        this.dataSource.data = [];
        this.totalLoaded = 0;
      }

      if (event?.pageIndex !== undefined) {
        this.pageNo = event.pageIndex;
        this.startpoint = this.pageNo * (this.pageSize || PAGELENGTH);
      }

      const data: any = {
        startpoint: this.startpoint,
        limit: this.pageSize || PAGELENGTH,
      };

      if (this.name) data.name = this.name;
      if (this.isCompanyLoggedIn) data.isBlocked = false;

      this.wardService.allCompanies(data).subscribe({
        next: (result) => {
          this.spinner.hide();
          if (result.success) {
            this.total = result.total ?? 0;
            this.categoryRes = result;
            this.dataSource.data = result.data || [];
            this.totalLoaded = this.dataSource.data.length;

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
            e.status === 0 ? 'Server not reachable.' : e.message || 'Unexpected error.';
          this.toastr.error(errorMsg, 'Error');
        },
      });
    }

    // =============================
    // 🔹 Submit Handler
    // =============================
    submit() {
      this.spinner.show();

      const data = new FormData();
      let name = this.categoryForm.value.name;
      const gender:any = this.categoryForm.value.gender;
      const templocation:any = this.categoryForm.value.location;
      if(templocation) {
        name = name +" ("+templocation+")";
      }
      if(gender) {
        name = name + " ("+gender+")";
      }

      data.append('name', name ?? '');
      data.append('ward_image', this.categoryForm.value.category_image ?? '');
      data.append('description','MDSS Wards');
      data.append('type',gender);
      data.append('location',templocation)

      if (this.formType === 'Add') {
        this.wardService.addCompany(data).subscribe({
          next: (v: any) => {
            this.spinner.hide();
            if (v.success) {
              this.toastr.success(v.message, 'Success');
              this.hideModel();
              this.getAllCategories(null);
            } else {
              this.toastr.error(v.message, 'Error');
              this.hideModel();
            }
          },
          error: (e: any) => {
            this.spinner.hide();
            this.toastr.error(e.message, 'Error');
            this.hideModel();
          },
          complete: () => {
            this.spinner.hide();
            this.hideModel();
          },
        });
      } else {
        data.append('_id', this.categoryId ?? '');
        this.wardService.updateCompany(data).subscribe({
          next: (v: any) => {
            this.spinner.hide();
            if (v.success) {
              this.toastr.success(v.message, 'Success');
              this.hideModel();
              this.getAllCategories(null);
            } else {
              this.toastr.error(v.message, 'Error');
              this.hideModel();
            }
          },
          error: (e: any) => {
            this.spinner.hide();
            this.toastr.error(e.message, 'Error');
            this.hideModel();
          },
          complete: () => {
            this.spinner.hide();
            this.hideModel();
          },
        });
      }
    }

    // =============================
    // 🔹 Block/Unblock Handler
    // =============================
    onToggleClick(element: any) {
      const currentStatus = element.isBlocked;
      const newStatus = !currentStatus;
      const action = newStatus ? 'Block' : 'Unblock';

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: `${action} this category?`,
          text: `This will ${action.toLowerCase()} the category.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: `${action}`,
          cancelButtonText: 'Cancel',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.wardService
              .enableDisableCompany({ _id: element._id, isBlocked: newStatus })
              .subscribe({
                next: (v: any) => {
                  if (v.success) {
                    element.isBlocked = newStatus;
                    this.toastr.success(`Category ${action.toLowerCase()}ed successfully.`);
                  } else {
                    this.toastr.error(v.message, 'Error');
                  }
                },
                error: (e: any) => {
                  this.toastr.error(e.message, 'Error');
                },
              });
          }
        });
      return false;
    }

}
