import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorSamplesReportComponent } from './distributor-samples-report.component';

describe('DistributorSamplesReportComponent', () => {
  let component: DistributorSamplesReportComponent;
  let fixture: ComponentFixture<DistributorSamplesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributorSamplesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorSamplesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
