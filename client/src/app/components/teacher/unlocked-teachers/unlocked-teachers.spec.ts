import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockedTeachers } from './unlocked-teachers';

describe('UnlockedTeachers', () => {
  let component: UnlockedTeachers;
  let fixture: ComponentFixture<UnlockedTeachers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockedTeachers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockedTeachers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
