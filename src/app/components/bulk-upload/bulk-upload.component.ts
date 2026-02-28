import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bulk-upload',
  imports: [CardComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss'
})
export class BulkUploadComponent {
  jsonData: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private sampleService: SampleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private wardService: CompanyService
  ) {}

  isCorrect = new FormControl(false);

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      this.jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log('Converted JSON:', this.jsonData);
    };

    reader.readAsArrayBuffer(file);
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  submit() {
    this.sampleService.addBulkMember({data:this.jsonData}).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/sample']);
        } else {
          // Build message: missing fields + row number
          const data: any = res.data;
          this.toastr.error(res.message, 'Error');
          const missing = data.missingFields?.join(', ') || 'Unknown fields';

          Swal.fire({
            icon: 'error',
            title: data.message || 'Validation Error',
            html: `
                <p><strong>Missing Fields:</strong> ${missing}</p>
                <pre style="text-align:left;background:#f3f3f3;padding:10px;border-radius:5px;max-height:150px;overflow:auto;">
                  ${JSON.stringify(data.rowData, null, 2)}
                </pre>
              `,
            width: 600
          });

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
}
