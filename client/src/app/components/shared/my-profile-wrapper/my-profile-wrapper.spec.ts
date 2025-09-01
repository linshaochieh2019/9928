import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileWrapper } from './my-profile-wrapper';

describe('MyProfileWrapper', () => {
  let component: MyProfileWrapper;
  let fixture: ComponentFixture<MyProfileWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
