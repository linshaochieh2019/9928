import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEmployerProfile } from './my-employer-profile';

describe('MyEmployerProfile', () => {
  let component: MyEmployerProfile;
  let fixture: ComponentFixture<MyEmployerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEmployerProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEmployerProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
