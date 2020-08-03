import { TestBed } from '@angular/core/testing';

import { SoundcardService } from './soundcard.service';

describe('SoundcardService', () => {
  let service: SoundcardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoundcardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
