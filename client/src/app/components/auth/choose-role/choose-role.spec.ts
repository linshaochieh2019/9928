import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseRole } from './choose-role';

describe('ChooseRole', () => {
  let component: ChooseRole;
  let fixture: ComponentFixture<ChooseRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseRole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseRole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
