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

@Component({
  selector: 'app-edit-sample',
  imports: [CardComponent, ReactiveFormsModule, EditorComponent, NgSelectModule, FormsModule],
  templateUrl: './edit-sample.component.html',
  styleUrl: './edit-sample.component.scss'
})
export class EditSampleComponent implements OnInit {


// Form field declarations
_id: any;
tinyAPiKey = 'ftw8ue85reubs65rxmfj2d18ds4g34g3eqopodomlwyyie7u';
tinymceConfig = {
  height: 500,
  menubar: true,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | removeformat | help'
};

// Reactive form initialization
sampleForm = new FormGroup({
  _id: new FormControl(''),
  categoryId: new FormControl(null),
  sampleCode: new FormControl('', [Validators.required]),
  name: new FormControl('', [Validators.required]),
  sample_images: new FormControl<File[]>([]),
  aboutSample: new FormControl(''),
  description: new FormControl(''),
  ingredients: new FormControl(''),
  usageInstructions: new FormControl(''),
  videoLink: new FormControl(''),
  quantityToBeAdded: new FormControl(0),
  maxIssueQuantityCustomer: new FormControl(0),
  maxIssueQuantityRetailer: new FormControl(0),
  maxIssueQuantityWholesaler: new FormControl(0),
  confirm: new FormControl(false, [Validators.requiredTrue]),
  videoTitle: new FormControl("")
});

// Dependencies injected
constructor(
  private categoryService: CategoryService,
  private sampleService: SampleService,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
  private router: Router,
  private activatedRoute: ActivatedRoute
) {}

// Lifecycle hook
ngOnInit(): void {
  this.getAllCategories();
  this._id = this.activatedRoute.snapshot.paramMap.get("_id");
  this.getSingleSample();
}

// Helper to get full image URL
getImg(imgPath: any) {
  return BASE_IMAGE_URL + imgPath;
}

// Fetch existing sample data if editing
singleSampleData: any;
getSingleSample() {
  this.sampleService.singleSample({ _id: this._id }).subscribe({
    next: (v: any) => {
      this.spinner.show();
      if (v.success) {
        this.singleSampleData = v.data;
        this.sampleForm.patchValue({
          _id: v.data?._id,
          categoryId: v.data?.categoryId._id,
          sampleCode: v.data?.sampleCode,
          name: v.data?.name,
          aboutSample: v.data?.aboutSample,
          description: v.data?.description,
          ingredients: v.data?.ingredients,
          usageInstructions: v.data?.usageInstructions,
          videoLink: v.data?.videoLink,
          maxIssueQuantityCustomer: v.data?.maxIssueQuantityCustomer,
          maxIssueQuantityRetailer: v.data?.maxIssueQuantityRetailer,
          maxIssueQuantityWholesaler: v.data?.maxIssueQuantityWholesaler,
          videoTitle:v.data?.videoTitle
        });

        if (v.data?.sampleImages?.length) {
          const sampleImageFiles = v.data.sampleImages.map((imgPath: string) => {
            const url = this.getImg(imgPath);
            const name = imgPath.split('/').pop();
            return {
              file: null,
              name: name,
              type: 'image/jpeg',
              size: 0,
              url: url,
              isSample: true
            };
          });

          this.sampleFiles = [...sampleImageFiles, ...this.sampleFiles];
        }
      } else {
        console.log(v.message);
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

// Fetch categories for dropdown
categories: any[] = [];
getAllCategories() {
  this.categoryService.allCategories({ isBlocked: false }).subscribe({
    next: (result) => {
      if (result.success) {
        this.categories = result.data;
      }
    },
    error: (e) => {
      this.toastr.error(e);
    }
  });
}

// Image handling
sampleFiles: any[] = [];


getFileDetails(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
        this.toastr.info("Only JPG, JPEG and PNG images are allowed.");
        continue;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {


        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.sampleFiles.push({
            file: file,
            name: file.name,
            type: file.type,
            size: file.size,
            url: e.target.result
          });
        };
        reader.readAsDataURL(file);

        // const aspectRatio = img.width / img.height;
        // if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
        // } else {
        //   this.toastr.error("Image must be in 16:9 aspect ratio.");
        // }
      };
    }
  }
}


removeFile(index: number) {
  this.sampleFiles.splice(index, 1);
}

// Submit form logic
isConfirmed = false;
submit() {
  this.spinner.show();
  let data = new FormData();

  const oldImagePaths: string[] = [];

  this.sampleFiles.forEach(fileObj => {
    if (fileObj.file instanceof File || fileObj.file instanceof Blob) {
      data.append('sample_images', fileObj.file);
    } else if (!fileObj.file && fileObj.url) {
      const parts = fileObj.url.split('/');
      const lastTwo = parts.slice(-1);
      const relativePath = '/sample/' + lastTwo.join('/');
      oldImagePaths.push(relativePath);
    }
  });

  data.append('oldImages', JSON.stringify(oldImagePaths));
  data.append('_id', this.sampleForm.value._id ?? '');
  data.append('categoryId', this.sampleForm.value.categoryId ?? '');
  data.append('sampleCode', this.sampleForm.value.sampleCode ?? '');
  data.append('name', this.sampleForm.value.name ?? '');
  data.append('aboutSample', this.sampleForm.value.aboutSample ?? '');
  data.append('description', this.sampleForm.value.description ?? '');
  data.append('ingredients', this.sampleForm.value.ingredients ?? '');
  data.append('usageInstructions', this.sampleForm.value.usageInstructions ?? '');
  data.append('videoLink', this.sampleForm.value.videoLink ?? '');
  data.append('quantityToBeAdded', this.sampleForm.value.quantityToBeAdded?.toString() ?? '0');
  data.append('maxIssueQuantityCustomer', this.sampleForm.value.maxIssueQuantityCustomer?.toString() ?? '0');
  data.append('maxIssueQuantityRetailer', this.sampleForm.value.maxIssueQuantityRetailer?.toString() ?? '0');
  data.append('maxIssueQuantityWholesaler', this.sampleForm.value.maxIssueQuantityWholesaler?.toString() ?? '0');
  data.append("videoTitle",this.sampleForm.value.videoTitle);

  this.sampleService.updateSample(data).subscribe({
    next: (v: any) => {
      this.spinner.hide();
      if (v.success) {
        this.toastr.success(v.message, 'Success');
        this.router.navigate(['/sample']);
      } else {
        this.spinner.hide();
        this.toastr.error(v.message, 'Error');
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
