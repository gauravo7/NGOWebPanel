import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RolePermissionService } from 'src/app/shared/service/rolePermission/role-permission.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-roles-permission',
  imports: [
    RouterLink,
    MatTableModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './add-roles-permission.component.html',
  styleUrl: './add-roles-permission.component.scss'
})
export class AddRolesPermissionComponent {
  roleForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    permissions: new FormControl(''),
    _id: new FormControl('')
  });

  allSelected: boolean = false;

  items = [
    {
      section: 'Dashboard',
      permissions: [{ name: 'DASHBOARD-MANAGE', checked: false }]
    },
    {
      section: 'Roles Permission',
      permissions: [{ name: 'ROLES-PERMISSION-MANAGE', checked: false }]
    },
    {
      section: 'User',
      permissions: [{ name: 'USER-MANAGE', checked: false }]
    },
    {
      section: 'Category',
      permissions: [
        { name: 'CATEGORY-ADD', checked: false },
        { name: 'CATEGORY-EDIT', checked: false },
        { name: 'CATEGORY-VIEW', checked: false },
        { name: 'CATEGORY-LIST', checked: false },
        { name: 'CATEGORY-DELETE', checked: false },
        { name: 'CATEGORY-CHANGE', checked: false }
      ]
    },
    {
      section: 'WARDS',
      permissions: [
        { name: 'WARD-ADD', checked: false },
        { name: 'WARD-EDIT', checked: false },
        { name: 'WARD-VIEW', checked: false },
        { name: 'WARD-LIST', checked: false },
        { name: 'WARD-DELETE', checked: false },
        { name: 'WARD-CHANGE', checked: false }
      ]
    },
    {
      section: 'Sample',
      permissions: [
        { name: 'MEMBER-ADD', checked: false },
        { name: 'MEMBER-EDIT', checked: false },
        { name: 'MEMBER-VIEW', checked: false },
        { name: 'MEMBER-LIST', checked: false },
        { name: 'MEMBER-UPLOAD', checked: false },
        { name: 'MEMBER-DELETE', checked: false },
        { name: 'MEMBER-MANAGE', checked: false },
        { name: 'MEMBER-DISCHARGE', checked: false },
        { name: 'MEMBER-IN', checked: false },
        { name: 'MEMBER-OUT', checked: false },
        { name: 'MEMBER-ADD-TREATMENT', checked: false },
        { name: 'MEMBER-VIEW-TREATMENT', checked: false },
        { name: 'MEMBER-SCAN', checked: false },
        { name: 'MISSING-LIST', checked: false },
      ]
    },
    {
      section: 'Wholesaler',
      permissions: [
        { name: 'WHOLESALER-ADD', checked: false },
        { name: 'WHOLESALER-EDIT', checked: false },
        { name: 'WHOLESALER-VIEW', checked: false },
        { name: 'WHOLESALER-LIST', checked: false },
        { name: 'WHOLESALER-DELETE', checked: false },
        { name: 'RETAILER-ASSIGN', checked: false }
      ]
    },
    {
      section: 'Retailer',
      permissions: [
        { name: 'RETAILER-ADD', checked: false },
        { name: 'RETAILER-EDIT', checked: false },
        { name: 'RETAILER-VIEW', checked: false },
        { name: 'RETAILER-LIST', checked: false },
        { name: 'RETAILER-DELETE', checked: false }
      ]
    },
    {
      section: 'Customer',
      permissions: [
        { name: 'CUSTOMER-ADD', checked: false },
        { name: 'CUSTOMER-EDIT', checked: false },
        { name: 'CUSTOMER-VIEW', checked: false },
        { name: 'CUSTOMER-LIST', checked: false },
        { name: 'CUSTOMER-DELETE', checked: false }
      ]
    },
    {
      section: 'Distributor',
      permissions: [
        { name: 'DISTRIBUTOR-LIST', checked: false },
        { name: 'SWITCH-DISTRIBUTOR-TYPE', checked: false },
        { name: 'REMOVED-ASSIGNED-DISTRIBUTOR', checked: false }
      ]
    },
    {
      section: 'Reports',
      permissions: [
        { name: 'DISTRIBUTOR-SUMMARY', checked: false },
        { name: 'CUSTOMER-SUMMARY', checked: false }
      ]
    }
  ];

  permissions: any = [];
  type: string = 'Add';

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _roleService: RolePermissionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      if (param.get('id') != undefined && param.get('id') != null) {
        this.type = 'Update';
        this.roleForm.patchValue({ _id: param.get('id') ?? undefined });
        this.getSingleRole(param.get('id'));
      } else {
        this.roleForm.patchValue({ _id: undefined });
      }
    });
  }

  getSingleRole(id: any) {
    this.spinner.show();
    this._roleService.singleRole({ _id: id }).subscribe({
      next: (v: any) => {
        if (v.success) {
          this.roleForm.patchValue({ name: v.data?.name });

          this.permissions = v.data?.permissions || [];
          this.roleForm.patchValue({ permissions: this.permissions });

          // Reset all checked first
          this.items.forEach((section) => {
            section.permissions.forEach((p: any) => (p.checked = false));
          });

          // Set checked to true for matching permissions
          this.permissions.forEach((permName: string) => {
            this.items.forEach((section) => {
              const perm = section.permissions.find((p: any) => p.name === permName);
              if (perm) perm.checked = true;
            });
          });

          this.updateAllSelected(); // update global select all checkbox state
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
      }
    });
  }

  submit() {
    if (this.permissions.length <= 0) {
      this.toastr.error('Please Select atleast one permission', 'Error');
      return;
    }
    this.roleForm.patchValue({ permissions: this.permissions });
    this.spinner.show();
    if (this.type == 'Add') {
      this._roleService.addRole(this.roleForm.value).subscribe({
        next: (v: any) => {
          var result = v;
          if (result.success) {
            this.toastr.success(result.message, 'Success');
            this.router.navigateByUrl('/roles');
          } else {
            this.toastr.error(result.message, 'Error');
            // this.router.navigateByUrl('/admin/home')
          }
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    } else {
      this._roleService.updateRole(this.roleForm.value).subscribe({
        next: (v: any) => {
          var result = v;
          if (result.success) {
            this.toastr.success(result.message, 'Success');
            this.router.navigateByUrl('/roles');
          } else {
            this.toastr.error(result.message, 'Error');
            // this.router.navigateByUrl('/admin/home')
          }
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
  }

  checkValue(per: any) {
    var a = this.permissions.filter((x: any) => x == per.name);
    if (a.length > 0) return true;
    else return false;
  }

  updateAllComplete(name: string, event: boolean) {
    if (event) {
      if (!this.permissions.includes(name)) {
        this.permissions.push(name);
      }
    } else {
      this.permissions = this.permissions.filter((p) => p !== name);
    }

    this.allSelected = this.items.every((section) => section.permissions.every((p) => p.checked));
  }

  isSectionSelected(section: any): boolean {
    return section.permissions.every((p: any) => p.checked);
  }

  toggleSection(section: any, checked: boolean) {
    section.permissions.forEach((p: any) => (p.checked = checked));
    this.updatePermissionsArray();
    this.updateAllSelected();
  }

  updatePermission(section: any, permission: any) {
    this.updatePermissionsArray();
    this.updateAllSelected();
  }

  updatePermissionsArray() {
    this.permissions = [];
    this.items.forEach((section) => {
      section.permissions.forEach((p: any) => {
        if (p.checked) this.permissions.push(p.name);
      });
    });
  }

  updateAllSelected() {
    this.allSelected = this.items.every((section) => section.permissions.every((p: any) => p.checked));
  }

  setAll(checked: boolean) {
    this.allSelected = checked;
    this.items.forEach((section) => section.permissions.forEach((p: any) => (p.checked = checked)));
    this.updatePermissionsArray();
  }
}
