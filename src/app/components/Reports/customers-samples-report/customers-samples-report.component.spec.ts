import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersSamplesReportComponent } from './customers-samples-report.component';

describe('CustomersSamplesReportComponent', () => {
  let component: CustomersSamplesReportComponent;
  let fixture: ComponentFixture<CustomersSamplesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersSamplesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersSamplesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
