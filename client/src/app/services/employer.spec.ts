import { TestBed } from '@angular/core/testing';

import { Employer } from './employer';

describe('Employer', () => {
  let service: Employer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Employer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
