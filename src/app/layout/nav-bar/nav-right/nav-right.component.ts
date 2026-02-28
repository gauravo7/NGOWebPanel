// angular import
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';

// project import
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  // public props

  // constructor

  userData: any
  constructor(
    private _userData: UserDataService,
    private toastr: ToastrService, private router: Router,
    private spinner: NgxSpinnerService
  ) {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-right';
  }


  ngOnInit(): void {
    this.userData = this._userData.getData()
  }




  logout() {
    this.spinner.show()
    this._userData.clearData()
    this.toastr.success("Logout Successfull")
    this.spinner.hide()
    this.router.navigateByUrl('/login')
  }
}
