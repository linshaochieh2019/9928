import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockModal } from './unlock-modal';

describe('UnlockModal', () => {
  let component: UnlockModal;
  let fixture: ComponentFixture<UnlockModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
