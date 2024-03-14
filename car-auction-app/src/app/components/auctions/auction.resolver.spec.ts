import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { auctionResolver } from './auction.resolver';

describe('auctionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => auctionResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
