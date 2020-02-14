import { TestBed } from '@angular/core/testing';

import { RetroService } from './retro.service';

describe('RetroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetroService = TestBed.get(RetroService);
    expect(service).toBeTruthy();
  });
});
