import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPoints } from './buy-points';

describe('BuyPoints', () => {
  let component: BuyPoints;
  let fixture: ComponentFixture<BuyPoints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyPoints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyPoints);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
