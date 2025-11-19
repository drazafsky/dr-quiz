import { TestBed } from '@angular/core/testing';

import { Repo } from './repo';

describe('Repo', () => {
  let service: Repo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Repo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
