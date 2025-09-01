import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerDetail } from './employer-detail';

describe('EmployerDetail', () => {
  let component: EmployerDetail;
  let fixture: ComponentFixture<EmployerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
