import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsComponent } from './auctions.component';

describe('AuctionsComponent', () => {
  let component: AuctionsComponent;
  let fixture: ComponentFixture<AuctionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuctionsComponent]
    });
    fixture = TestBed.createComponent(AuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
