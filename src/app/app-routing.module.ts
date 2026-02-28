import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { authGuard } from './shared/guards-inteceptor/auth.guard';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { CategoryComponent } from './components/category/category.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomersSamplesReportComponent } from './components/Reports/customers-samples-report/customers-samples-report.component';
import { DistributorSamplesReportComponent } from './components/Reports/distributor-samples-report/distributor-samples-report.component';
import { AddSampleComponent } from './components/sample/add-sample/add-sample.component';
import { EditSampleComponent } from './components/sample/edit-sample/edit-sample.component';
import { SampleComponent } from './components/sample/sample.component';
import { UsersComponent } from './components/users/users.component';
import { AdminComponent } from './layout/admin.component';
import { AddRolesPermissionComponent } from './roles-permission/add-roles-permission/add-roles-permission.component';
import { RolesPermissionComponent } from './roles-permission/roles-permission.component';
import { WardsComponent } from './components/wards/wards.component';
import { PreviewMembersComponent } from './components/sample/preview-members/preview-members.component';
import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: SigninComponent
  },
  {
    path: 'reset-Password',
    component: ForgotPasswordComponent
  },
  {
    path: '', component: AdminComponent,
    canActivate: [authGuard], children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'wards',
        component: WardsComponent
      },
      {
        path: 'members',
        component: SampleComponent
      },
      {
        path: 'members/add',
        component: AddSampleComponent
      },
      {
        path: 'members/edit/:_id',
        component: EditSampleComponent
      },
      {
        path: 'members/bulk',
        component: BulkUploadComponent
      },
      {
        path:'member/view/:id',
        component:PreviewMembersComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'roles',
        component: RolesPermissionComponent
      },
      {
        path: 'roles/add',
        component: AddRolesPermissionComponent
      },
      {
        path: 'roles/edit/:id',
        component: AddRolesPermissionComponent
      },
      {
        path: 'distributors/samples/report',
        component: DistributorSamplesReportComponent
      },
      {
        path: 'customer/samples/report',
        component: CustomersSamplesReportComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
