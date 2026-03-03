import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SHARED_IMPORTS } from 'src/app/shared-imports';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { BASE_IMAGE_URL } from '../../endpoints';

@Component({
  selector: 'app-scan-person',
  imports: [SHARED_IMPORTS,ReactiveFormsModule,CommonModule],
  templateUrl: './scan-person.component.html',
  styleUrl: './scan-person.component.scss'
})
export class ScanPersonComponent {
  scanForm!: FormGroup;
  selectedFile: File | null = null;
  scanResults:any = [];
  BASE_IMAGE_URL:any = BASE_IMAGE_URL

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private members:SampleService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService
  ) {}

  ngOnInit() {
    this.scanForm = this.fb.group({});
  }

  // when user selects file
  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  // submit scan
  scanPerson() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('scan_image', this.selectedFile);
    this.spinner.show();

    this.members.scanPerson(formData).subscribe({
          next: (v: any) => {
            this.spinner.hide();
            if (v.success) {
              this.toastr.success(v.message, 'Success');
              this.scanResults = v.data;


            } else {
              this.toastr.error(v.message, 'Error');
            }
          },
          error: (e: any) => {
            this.spinner.hide();
            this.toastr.error(e.message, 'Error');
          },
          complete: () => {
            this.spinner.hide();
          },
        });
  }
}
