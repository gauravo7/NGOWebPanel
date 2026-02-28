import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSampleComponent } from './edit-sample.component';

describe('EditSampleComponent', () => {
  let component: EditSampleComponent;
  let fixture: ComponentFixture<EditSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
