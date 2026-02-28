import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { BASE_IMAGE_URL } from '../../../endpoints';

@Component({
  selector: 'app-preview-members',
  imports: [MatTabsModule,CommonModule,RouterLink],
  templateUrl: './preview-members.component.html',
  styleUrl: './preview-members.component.scss'
})
export class PreviewMembersComponent {


  personId:any = "";
  data:any = "";
  wardData:any = [];
  categoryData:any = [];
  treatmentData:any = [];
  BASE_IMAGE_URL= BASE_IMAGE_URL;
  constructor(private activatedRoute:ActivatedRoute,private spinner:NgxSpinnerService,private sampleService:SampleService,private toastr:ToastrService){}

  ngOnInit(): void {
     this.personId = this.activatedRoute.snapshot.paramMap.get("id");
     console.log(this.personId);
     if(this.personId) {
      this.singlePersonId();
      this.getAllTreatmentLogs();
      this.getWardsLogs();
      this.getAllCategoriesLogs();

     }
  }


  singlePersonId(){
    this.spinner.show();
    this.sampleService.singleSample({_id:this.personId}).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.data = res.data;
        } else {
          this.toastr.error(res.message, 'Error');
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

  getAllTreatmentLogs(){

    this.spinner.show();
    this.sampleService.getTreatment({personId:this.personId}).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.treatmentData = res.data;
        } else {
          this.toastr.error(res.message, 'Error');
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


   getAllCategoriesLogs(){

    this.spinner.show();
    this.sampleService.getCategoryLogs({personId:this.personId}).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.categoryData = res.data;
          console.log(this.categoryData);
        } else {
          this.toastr.error(res.message, 'Error');
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

   getWardsLogs(){

    this.spinner.show();
    this.sampleService.getWardLogs({personId:this.personId}).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.wardData = res.data;
          console.log(this.wardData);
        } else {
          this.toastr.error(res.message, 'Error');
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
