import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPersonComponent } from './scan-person.component';

describe('ScanPersonComponent', () => {
  let component: ScanPersonComponent;
  let fixture: ComponentFixture<ScanPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
