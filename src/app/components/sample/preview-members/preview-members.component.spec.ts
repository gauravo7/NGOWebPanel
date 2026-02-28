import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMembersComponent } from './preview-members.component';

describe('PreviewMembersComponent', () => {
  let component: PreviewMembersComponent;
  let fixture: ComponentFixture<PreviewMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
