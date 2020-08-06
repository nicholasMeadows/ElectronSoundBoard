import { TestBed } from '@angular/core/testing';

import { MainviewSearchbarService } from './soundcard-searchbar.service';

describe('MainviewSearchbarService', () => {
  let service: MainviewSearchbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainviewSearchbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
