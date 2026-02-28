import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RolePermissionService } from 'src/app/shared/service/rolePermission/role-permission.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-roles-permission',
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './roles-permission.component.html',
  styleUrl: './roles-permission.component.scss'
})
export class RolesPermissionComponent {
  roleData: any
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private roleService: RolePermissionService,
    private router: Router
    // ,
    // private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllRoles()
  }

  getAllRoles() {
    this.spinner.show()
    this.roleService.getRole({}).subscribe({
      next: (v: any) => {
        if (v.success) {
          this.roleData = v.data
        } else {
          this.toastr.error(v.message, 'Error')
          this.router.navigateByUrl('/admin/home')
        }
      },
      error: (e: any) => {
        this.spinner.hide()
        this.toastr.error(e.error.message, 'Error')
      },
      complete: () => { this.spinner.hide() }
    })
  }


  openDeleteDialog(roleId: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: `Delete this role?`,
      text: `This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.roleService.deleteRole({ _id: roleId }).subscribe({
          next: (v: any) => {
            if (v.success) {
              swalWithBootstrapButtons.fire({
                title: `Deleted`,
                text: `Role deleted successfully.`,
                icon: "success"
              });
              this.getAllRoles()
            } else {
              this.toastr.error(v.message, 'Error');
            }
          },
          error: (e: any) => {
            this.toastr.error(e.message, 'Error');
          },
          complete: () => this.spinner.hide()
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: `Role deletion was cancelled.`,
          icon: "info"
        });
      }
    });
  }


}
