import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardsComponent } from './wards.component';

describe('WardsComponent', () => {
  let component: WardsComponent;
  let fixture: ComponentFixture<WardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
