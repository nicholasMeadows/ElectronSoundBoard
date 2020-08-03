import { TestBed } from '@angular/core/testing';

import { StreamdeckService } from './streamdeck.service';

describe('StreamdeckService', () => {
  let service: StreamdeckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StreamdeckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
