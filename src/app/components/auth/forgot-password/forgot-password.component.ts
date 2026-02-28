import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';
import { UserServiceService } from 'src/app/shared/service/userService/user-service.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule,RouterLink,CommonModule,FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {


  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserServiceService,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
  ) { }

  step:any=1;
  email:any =''
  userObj:any = "";
  showPassword='password';


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  otpForm = new FormGroup({
    otp0: new FormControl('', [Validators.required]),
    otp1: new FormControl('', [Validators.required]),
    otp2: new FormControl('', [Validators.required]),
    otp3: new FormControl('', [Validators.required])

  })

  newPasswordForm = new FormGroup({
    _id:new FormControl(''),
    password: new FormControl('',[Validators.required])
  })


  submit() {
    this.spinner.show();
    this.userService.requestOTP(this.loginForm.value).subscribe({
      next: (v: any) => {
        if (v.success) {
          this.toastr.success(v.message, 'Success');
          this.email = this.loginForm.value?.email;
          this.step=2;
        } else {
          this.toastr.error(v.message);
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


  verifyOTP() {
    this.spinner.show();
    const data:any = this.otpForm.value;
    const otp = parseInt(data.otp0+data.otp1+data.otp2+data.otp3)

    const payload = {
        email:this.email,
        otp:otp
      }
    this.userService.verifyOTP(payload).subscribe({
      next: (v: any) => {
        if (v.success) {
          this.toastr.success(v.message, 'Success');
          this.newPasswordForm.patchValue({_id:v.data._id})
          this.step=3;
        } else {
          this.toastr.error(v.message);
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


  otp: string[] = ['', '', '', ''];

  @ViewChild('otp0') otp0!: ElementRef;
  @ViewChild('otp1') otp1!: ElementRef;
  @ViewChild('otp2') otp2!: ElementRef;
  @ViewChild('otp3') otp3!: ElementRef;

  moveToNext(event: any, index: number) {
    const input = event.target;
    const nextInput = index + 1;
    const prevInput = index - 1;

    // If user entered a digit, move to the next input
    if (input.value.length === 1 && nextInput < 4) {
      const nextElement = this[`otp${nextInput}`];
      if (nextElement) nextElement.nativeElement.focus();
    }

    // If user pressed backspace on empty input, move to the previous input
    if (event.inputType === 'deleteContentBackward' && prevInput >= 0) {
      const prevElement = this[`otp${prevInput}`];
      if (prevElement) prevElement.nativeElement.focus();
    }
  }


toggleShowPassword(params:any) {
  if(params==='text') {
      this.showPassword = 'password';
  } else {
    this.showPassword = 'text'
  }
}

forgotPassword(){
  this.spinner.show();
    this.userService.forgotPassword(this.newPasswordForm.value).subscribe({
      next: (v: any) => {
        if (v.success) {
          this.toastr.success(v.message, 'Success');
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.error(v.message);
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
