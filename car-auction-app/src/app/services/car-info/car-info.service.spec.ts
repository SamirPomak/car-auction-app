import { TestBed } from '@angular/core/testing';

import { CarInfoService } from './car-info.service';

describe('CarInfoService', () => {
  let service: CarInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
