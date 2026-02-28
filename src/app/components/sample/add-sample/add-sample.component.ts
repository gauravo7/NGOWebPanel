import { Component, OnInit } from '@angular/core';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-sample',
  imports: [CardComponent, ReactiveFormsModule, EditorComponent, NgSelectModule,CommonModule],
  templateUrl: './add-sample.component.html',
  styleUrl: './add-sample.component.scss'
})
export class AddSampleComponent implements OnInit {


  // TinyMCE API Key
  tinyAPiKey = 'ftw8ue85reubs65rxmfj2d18ds4g34g3eqopodomlwyyie7u';

  wardData:any = [];

  // TinyMCE editor configuration
  tinymceConfig = {
    height: 500,
    menubar: true,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | removeformat | help'
  };

  // Category dropdown data
  categories: any[] = [];

  // Uploaded file list with metadata
  face_image: any[] = [];
  personreg_image:any = [];
  personphoto_image:any = [];

  // Reactive form for adding/editing a sample
  sampleForm = new FormGroup({
    categoryId: new FormControl(null),
    regNo: new FormControl('', [Validators.required]),
    name: new FormControl(''),
    height: new FormControl(''),
    findLocation: new FormControl(""),
    isHome: new FormControl(''),
    gender: new FormControl(''),
    wardId: new FormControl(''),
    remarks: new FormControl(""),
    videoLink: new FormControl(""),
    ageRange:new FormControl(""),
    sample_images: new FormControl<File[]>([]),
    confirm: new FormControl(false),
    videoTitle: new FormControl(""),
    isFinder: new FormControl(false),

    finderName: new FormControl(''),
    finderPhone: new FormControl(null),
    finderAnotherPhone: new FormControl(null),
    finderProofType: new FormControl(''),
    finderProofNo: new FormControl(''),
    finderAddress: new FormControl(''),

    isFamily: new FormControl(false),

    familyName: new FormControl(''),
    familyPhone: new FormControl(null),
    familyAnotherPhone: new FormControl(null),
    familyProofType: new FormControl(''),
    familyProofNo: new FormControl(''),
    familyAddress: new FormControl('')
  });

  // --------------------- CONSTRUCTOR ---------------------

  constructor(
    private categoryService: CategoryService,
    private sampleService: SampleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private wardService:CompanyService
  ) { }

  // --------------------- LIFECYCLE ---------------------

  ngOnInit(): void {
    this.getAllCategories();
    this.fetchWards();
  }

  // --------------------- METHODS ---------------------

  // ✅ Fetch all unblocked categories
  getAllCategories() {
    this.categoryService.allCategories({ isBlocked: false }).subscribe({
      next: (result) => {
        if (result.success) {
          this.categories = result.data;
          console.log(this.categories);
        }
      },
      error: (e) => {
        this.toastr.error(e);
      }
    });
  }

getFileDetails(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png'
      ) {
        this.toastr.info("Only JPG, JPEG and PNG images are allowed.");
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.face_image.push({
          file: file,
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}


getFileDetails1(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png'
      ) {
        this.toastr.info("Only JPG, JPEG and PNG images are allowed.");
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.personreg_image.push({
          file: file,
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}

getFileDetails2(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png'
      ) {
        this.toastr.info("Only JPG, JPEG and PNG images are allowed.");
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.personphoto_image.push({
          file: file,
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}


  removeFile(index: number) {
    // this.myFiles.splice(index, 1);
  }

  submit() {
    this.spinner.show();

    const data = new FormData();

    const filled = this.sampleForm.value;

    if(filled.isFinder) {
      const finderdetail = {
          name: filled.finderName??"",
          phone: filled.finderPhone??0,
          anotherPhone: filled.finderAnotherPhone??0,
          proofType: filled.finderProofType??"",
          proofNo: filled.finderProofNo??"",
          address: filled.familyAddress??""
      }
      data.append('finderPersonDetail',JSON.stringify(finderdetail))
    }


      if(filled.isFamily) {
      const familydetail = {
          name: filled.familyName??"",
          phone: filled.familyPhone??0,
          anotherPhone: filled.familyAnotherPhone??0,
          proofType: filled.familyProofType??"",
          proofNo: filled.familyProofNo??"",
          address: filled.familyAddress??""
      }
      data.append('familyDetail',JSON.stringify(familydetail))
    }

    // Append images
    for (let i = 0; i < this.personphoto_image.length; i++) {
      data.append('personphoto_image', this.personphoto_image[i].file);
    }

    // // Append form values
    data.append('categoryId', this.sampleForm.value.categoryId ?? '');
    data.append('regNo', this.sampleForm.value.regNo ?? '');
    data.append('name', this.sampleForm.value.name ?? '');
    data.append('height', this.sampleForm.value.height ?? '');
    data.append('findLocation', this.sampleForm.value.findLocation ?? '');
    data.append('isHome', this.sampleForm.value.isHome ?? '');
    data.append('gender', this.sampleForm.value.gender ?? '');
    data.append('wardId', this.sampleForm.value.wardId ?? '');
    data.append('remarks', this.sampleForm.value.remarks ?? '');
    data.append('videoLink', this.sampleForm.value.videoLink ?? '');
    data.append('ageRange', this.sampleForm.value.ageRange ?? '');
    data.append('face_image', this.face_image[0].file ?? '');
    data.append('personreg_image', this.personreg_image[0].file ?? '');



    this.sampleService.addSample(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/sample']);
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

  wardCategories = [{name:'Home',id:1},{name:"Hospital", id:2}];
  genders = [{name:'Male',id:1},{name:"Female", id:2}];
  peopleType:any = [{name:"Home less",id:1},{name:"Other",id:1}]



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
