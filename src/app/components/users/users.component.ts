import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgToggleModule } from 'ng-toggle-button';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BASE_IMAGE_URL, PAGELENGTH } from 'src/app/endpoints';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { UserServiceService } from 'src/app/shared/service/userService/user-service.service';
import { MatIcon } from '@angular/material/icon';

import { RolePermissionService } from 'src/app/shared/service/rolePermission/role-permission.service';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/shared/service/company/company.service';


declare var bootstrap: any;

@Component({
  selector: 'app-users',
  imports: [
    CardComponent,
    MatTableModule,
    MatPaginatorModule,
    NgToggleModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatIcon,
    NgClass,
    CommonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  formType: string = 'Add';
  userModal: any;
  startpoint: number = 0;
  search: any;
  totalLoaded: number = 0;
  total: number = 0;
  pageNo: number = 0;
  userId: any;
  name: any = '';
  wardData:any = [];

  userType:any = -1;

  // 1: Admins, 2: Ward Incharge, 3: Volunteer, 4: Doctor
  userTypeArray:any = [{no:1,name:"Admin"},{no:2,name:'Ward-Incharge'},{no:3,name:'Volunteer'},{no:4,name:'Doctor'}]

  roles: any[] = []

  displayedColumns: string[] = ['position', 'name', 'email', 'contact', 'role', 'userType', 'isBlocked', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef;

  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private userService: UserServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private roleService: RolePermissionService,
    private router: Router,
    private wardService:CompanyService

  ) { }

  ngOnInit(): void {
    this.getAllUsers(null);
    this.getRoles();
    this.fetchWards();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    const userModalElement = document.getElementById('userModal');
    if (userModalElement) {
      this.userModal = new bootstrap.Modal(userModalElement);
    }
  }

  getImg(imgPath: string): string {
    return BASE_IMAGE_URL + imgPath;
  }

  filter(event: any): void {
    this.name = event.target.value?.trim();
    if (!this.name) delete this.name;
    this.getAllUsers(null);
  }

  getAllUsers(event: any): void {
    this.spinner.show();

    if (event == null) {
      this.startpoint = 0;
      this.dataSource.data = [];
    }

    const data: any = {
      startpoint: this.startpoint,
      ...(!!this.search && { search: this.search }),
      ...(!!this.name && { name: this.name })
    };

    if (this.totalLoaded === 0 || event == null || ((this.totalLoaded < this.total) && (event.pageIndex > this.pageNo))) {
      this.userService.getAllUsers(data).subscribe({
        next: (result) => {
          this.spinner.hide();
          if (result.success) {
            this.total = result.total ?? 0;
            this.dataSource.data = [...this.dataSource.data, ...(result.data || [])];
            this.totalLoaded = this.dataSource.data.length;
            this.startpoint = this.totalLoaded;
            this.pageNo = this.paginator?.pageIndex || 0;
            setTimeout(() => {
              this.paginator.length = this.total;
              this.paginator.pageSize = PAGELENGTH;
            }, 10);
          }
        },
        error: (e: any) => {
          this.spinner.hide();
          const errorMsg = e.status === 0
            ? "Server not reachable. Try again later."
            : e.message || 'An unexpected error occurred.';
          this.toastr.error(errorMsg, 'Error');
        },
        complete: () => this.spinner.hide()
      });
    } else {
      this.spinner.hide();
    }
  }



  userForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    role: new FormControl('', [Validators.required]),
    userType: new FormControl(2),
    isWard:new FormControl(false),
    assignedWard: new FormControl('')
  });

  openModel(type: string, userId: any): void {
    this.formType = type;
    this.userId = userId;

    if (userId) {
      this.spinner.show();
      this.userService.singleUser({ _id: userId }).subscribe({
        next: (v: any) => {
          if (v.success) {

            this.userForm.patchValue({
              _id: v.data?._id ?? null,
              name: v.data?.name ?? null,
              email: v.data?.email ?? null,
              phone: v.data?.phone ?? null,
              role: v.data?.role?._id ?? null,
            });


            console.log(v.data.role);
          }
          else {
            console.log(v.message);
          }
        },
        error: (e: any) => {
          this.toastr.error(e.message, 'Error');
        },
        complete: () => this.spinner.hide()
      });
    }

    this.userModal.show();
  }

  hideModel(): void {
    this.userForm.reset();
    this.userModal.hide();
    this.getAllUsers(null)
  }

  roleList: any = [];
  getRoles() {
    this.spinner.show();
    this.roleService.getRole({}).subscribe({
      next: (v: any) => {
        if (v.success) {
          this.roleList = v.data;
        } else {
          this.toastr.error(v.message, 'Error');
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.error.message, 'Error');
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  submit() {

    this.spinner.show();
    if (this.formType == 'Add') {
      this.userForm.patchValue({ _id: undefined });

      this.userService.addUser(this.userForm.value).subscribe({
        next: (v: any) => {
          if (v.success) {
            this.toastr.success(v.message, 'Success');
            // this.router.navigateByUrl('/admin/users')
            this.hideModel()
          } else {
            this.toastr.error(v.message, 'Error');
          }
        },
        error: (e: any) => {
          this.spinner.hide();
          this.toastr.error(e.error.message, 'Error');
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    } else {
      // console.log("form value is ", this.userForm.value)
      // this.userForm.patchValue({  })

      this.userService.updateUsers(this.userForm.value).subscribe({
        next: (v: any) => {
          if (v.success) {
            this.toastr.success(v.message, 'Success');
            this.hideModel()
          } else {
            this.toastr.error(v.message, 'Error');
          }
        },
        error: (e: any) => {
          this.spinner.hide();
          this.toastr.error(e.error.message, 'Error');
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }

  userStatus(_id: any, isBlocked: boolean): void {
    const action = isBlocked ? 'Block' : 'Unblock';
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: `${action} this user?`,
      text: `This will ${isBlocked ? 'block' : 'unblock'} the user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `${action}`,
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.enableDisableUser({ _id, isBlocked }).subscribe({
          next: (v: any) => {
            if (v.success) {
              swalWithBootstrapButtons.fire(`${action}ed`, `User ${action.toLowerCase()}ed successfully.`, "success");
            } else {
              this.toastr.error(v.message, 'Error');
            }
            this.getAllUsers(null);
          },
          error: (e: any) => {
            this.toastr.error(e.message, 'Error');
            this.getAllUsers(null);
          },
          complete: () => this.spinner.hide()
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelled", `${action} was cancelled.`, "error");
        this.getAllUsers(null);
      }
    });
  }

  fetchWards(){
     this.wardService.allCompanies({}).subscribe({
        next: (result) => {
          this.spinner.hide();
          if (result.success) {
            this.wardData = result.data;
          }
        },
        error: (e: any) => {
          this.spinner.hide();
          this.toastr.error(e.message, 'Error');
        },
      });
  }
}
