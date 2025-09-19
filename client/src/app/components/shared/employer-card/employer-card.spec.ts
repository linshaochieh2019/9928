import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerCard } from './employer-card';

describe('EmployerCard', () => {
  let component: EmployerCard;
  let fixture: ComponentFixture<EmployerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
