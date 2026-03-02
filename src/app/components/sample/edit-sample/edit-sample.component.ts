import { Component, OnInit } from '@angular/core';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryService } from 'src/app/shared/service/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { SampleService } from 'src/app/shared/service/sample/sample.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE_IMAGE_URL } from 'src/app/endpoints';
import { CompanyService } from 'src/app/shared/service/company/company.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-sample',
  imports: [CardComponent, ReactiveFormsModule, EditorComponent, NgSelectModule, FormsModule, CommonModule],
  templateUrl: './edit-sample.component.html',
  styleUrl: './edit-sample.component.scss'
})
export class EditSampleComponent implements OnInit {
  _id: any;

  categories: any[] = [];
  wardData: any[] = [];

  personPhotos: any[] = [];
  face_image: any[] = [];
  personreg_image: any[] = [];

  data: any = {};

  constructor(
    private peopleService: SampleService,
    private categoryService: CategoryService,
    private wardService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._id = this.activatedRoute.snapshot.paramMap.get('_id');
    this.getCategories();
    this.getWards(undefined);
    this.getSinglePerson();
  }

  getCategories() {
    this.categoryService.allCategories({}).subscribe((res) => {
      if (res.success) this.categories = res.data;
    });
  }

  getWards(type:any) {
    this.wardService.allCompanies({type:type}).subscribe((res) => {
      if (res.success) this.wardData = res.data;
    });
  }


  filterHome(){
    const data:any = this.sampleForm?.value?.isHome;
     if(data===1) {
      this.getWards('Home');
    } else if(data.isHome===2) {
      this.getWards('Hospital');
    } else {
      this.getWards(undefined);
    }
  }

  getSinglePerson() {
    this.peopleService.singleSample({ _id: this._id }).subscribe((res) => {
      if (res.success) {
        const data = res.data;
        this.data = res.data;

        this.sampleForm.patchValue({
          categoryId: data.categoryId?._id,
          regNo: data?.regNo,
          name: data?.name,
          height: data?.height,
          findLocation: data?.findLocation,
          isHome: data?.isHome,
          gender: data?.gender,
          wardId: data?.wardId,
          remarks: data?.remarks,
          videoLink: data?.videoLink,
          ageRange: data?.ageRange,

          finderName: data?.finderPersonDetail?.name,
          finderPhone: data?.finderPersonDetail?.phone,
          finderAnotherPhone: data?.finderPersonDetail?.anotherPhone,
          finderProofType: data?.finderPersonDetail?.proofType,
          finderProofNo: data?.finderPersonDetail?.proofNo,
          finderAddress: data?.finderPersonDetail?.address,

          familyName: data?.familyDetail?.name,
          familyPhone: data?.familyDetail?.phone,
          familyAnotherPhone: data?.familyDetail?.anotherPhone,
          familyProofType: data?.familyDetail?.proofType,
          familyProofNo: data?.familyDetail?.proofNo,
          familyAddress: data?.familyDetail?.address
        });
        // MULTIPLE PHOTOS
        if (data.photos?.length) {
          this.personPhotos = data.photos.map((img: string) => ({
            file: null,
            url: BASE_IMAGE_URL + img,
            path: img,
            isOld: true,
            type:'image'
          }));
        }

        // FACE IMAGE
        if (data.face_image) {
          this.faceImage = {
            file: null,
            url: BASE_IMAGE_URL + data.face_image,
            path: data.face_image,
            isOld: true
          };
        }

        // REG IMAGE
        if (data.regImage) {
          this.regImage = {
            file: null,
            url: BASE_IMAGE_URL + data.regImage,
            path: data.regImage,
            isOld: true
          };
        }
      }
    });
  }

  onPersonPhotoSelect(event: any) {
    const files = event.target.files;

    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.personPhotos.push({
          file: file,
          url: e.target.result,
          isOld: false
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removePersonPhoto(index: number) {
    this.personPhotos.splice(index, 1);
  }

  onFaceSelect(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.faceImage = {
        file: file,
        url: e.target.result,
        isOld: false
      };
    };
    reader.readAsDataURL(file);
  }

  onRegSelect(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.regImage = {
        file: file,
        url: e.target.result,
        isOld: false
      };
    };
    reader.readAsDataURL(file);
  }

  // submit() {
  //   this.spinner.show();

  //   const data = new FormData();
  //   const oldPhotos: string[] = [];

  //   this.personPhotos.forEach((photo) => {
  //     if (photo.file instanceof File) {
  //       data.append('personphoto_image', photo.file);
  //     } else if (photo.isOld) {
  //       oldPhotos.push(photo.path);
  //     }
  //   });

  //   data.append('oldPhotos', JSON.stringify(oldPhotos));

  //   Object.keys(this.sampleForm.value).forEach((key) => {
  //     data.append(key, this.sampleForm.value[key] ?? '');
  //   });

  //   if (this.face_image.length) {
  //     data.append('face_image', this.face_image[0].file);
  //   }

  //   if (this.personreg_image.length) {
  //     data.append('personreg_image', this.personreg_image[0].file);
  //   }

  //   this.peopleService.updateSample(data).subscribe({
  //     next: (res: any) => {
  //       this.spinner.hide();
  //       if (res.success) {
  //         this.toastr.success(res.message);
  //         this.router.navigate(['/people']);
  //       }
  //     },
  //     error: (err) => {
  //       this.spinner.hide();
  //       this.toastr.error(err.message);
  //     }
  //   });
  // }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  personphoto_image: any = [];

  // Reactive form for adding/editing a sample
  sampleForm = new FormGroup({
    categoryId: new FormControl(null,[Validators.required]),
    regNo: new FormControl('', [Validators.required]),
    wardId: new FormControl('',[Validators.required]),
    isHome: new FormControl('',[Validators.required]),
    name: new FormControl(''),
    height: new FormControl(''),
    findLocation: new FormControl(''),
    gender: new FormControl(''),
    remarks: new FormControl(''),
    videoLink: new FormControl(''),
    ageRange: new FormControl(''),
    sample_images: new FormControl<File[]>([]),
    confirm: new FormControl(false),
    videoTitle: new FormControl(''),
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

  // --------------------- METHODS ---------------------

  // Fetch all unblocked categories
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
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
          this.toastr.info('Only JPG, JPEG and PNG images are allowed.');
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
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
          this.toastr.info('Only JPG, JPEG and PNG images are allowed.');
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
        if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
          this.toastr.info('Only JPG, JPEG and PNG images are allowed.');
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

    if (filled.isFinder) {
      const finderdetail = {
        name: filled.finderName ?? '',
        phone: filled.finderPhone ?? 0,
        anotherPhone: filled.finderAnotherPhone ?? 0,
        proofType: filled.finderProofType ?? '',
        proofNo: filled.finderProofNo ?? '',
        address: filled.familyAddress ?? ''
      };
      data.append('finderPersonDetail', JSON.stringify(finderdetail));
    }

    if (filled.isFamily) {
      const familydetail = {
        name: filled.familyName ?? '',
        phone: filled.familyPhone ?? 0,
        anotherPhone: filled.familyAnotherPhone ?? 0,
        proofType: filled.familyProofType ?? '',
        proofNo: filled.familyProofNo ?? '',
        address: filled.familyAddress ?? ''
      };
      data.append('familyDetail', JSON.stringify(familydetail));
    }

    // -------- HANDLE MULTIPLE PHOTOS --------
    const oldPhotos: string[] = [];

    this.personPhotos.forEach((photo) => {
      if (photo.file instanceof File) {
        data.append('personphoto_image', photo.file);
      } else if (photo.isOld) {
        oldPhotos.push(photo.path);
      }
    });

    data.append('oldPhotos', JSON.stringify(oldPhotos));

    // -------- HANDLE FACE IMAGE --------
    if (this.faceImage) {
      if (this.faceImage.file instanceof File) {
        data.append('face_image', this.faceImage.file);
      } else if (this.faceImage.isOld) {
        data.append('oldFaceImage', this.faceImage.path);
      }
    }

    // -------- HANDLE REG IMAGE --------
    if (this.regImage) {
      if (this.regImage.file instanceof File) {
        data.append('personreg_image', this.regImage.file);
      } else if (this.regImage.isOld) {
        data.append('oldRegImage', this.regImage.path);
      }
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
    data.append('_id', this._id);

    this.peopleService.updateSample(data).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/members']);
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

  wardCategories = [
    { name: 'Home', id: 1 },
    { name: 'Hospital', id: 2 }
  ];
  genders = [
    { name: 'Male', id: 1 },
    { name: 'Female', id: 2 }
  ];
  peopleType: any = [
    { name: 'Home less', id: 1 },
    { name: 'Other', id: 1 }
  ];

  fetchWards(type:any) {
    this.wardService.allCompanies({type:type}).subscribe({
      next: (result) => {
        this.spinner.hide();
        if (result.success) {
          this.wardData = result.data;
        }
      },
      error: (e: any) => {
        this.spinner.hide();
        this.toastr.error(e.message, 'Error');
      }
    });
  }

  faceImage: any = null;
  regImage: any = null;
}
