import { TestBed } from '@angular/core/testing';

import { Repo } from './repo';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Repo', () => {
  let service: Repo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
      ]
    });
    service = TestBed.inject(Repo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
