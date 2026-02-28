import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import { UserServiceService } from 'src/app/shared/service/userService/user-service.service';


@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnInit {

  // Used to control password visibility
  showPassword = 'password';

  // Reactive form setup with validations
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserServiceService,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
  ) { }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.userDataService.isLogin()) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  // Triggered when login form is submitted
  submit(): void {
    this.spinner.show(); // Show loading spinner
    this.userService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Save user data and redirect
          this.userDataService.setData(response);
          this.toastr.success(response.message, 'Success');
          this.router.navigateByUrl('/dashboard');
        } else {
          // Show error if login fails
          this.toastr.error(response.message);
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        let errorMsg = 'An unexpected error occurred.';
        if (error.status === 0) {
          errorMsg = 'Server not reachable. Try again later.';
        } else if (error.message) {
          errorMsg = error.message;
        }
        this.toastr.error(errorMsg, 'Error');
      },
      complete: () => {
        this.spinner.hide(); // Hide spinner after API call completes
      }
    });
  }

  // Toggle password input type between text and password
  toggleShowPassword(type: string): void {
    if (type === 'text') {
      this.showPassword = 'password';
    } else {
      this.showPassword = 'text';
    }
  }
}
