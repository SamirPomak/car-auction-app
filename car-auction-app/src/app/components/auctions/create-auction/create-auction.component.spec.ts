import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuctionComponent } from './create-auction.component';

describe('CreateAuctionComponent', () => {
  let component: CreateAuctionComponent;
  let fixture: ComponentFixture<CreateAuctionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAuctionComponent]
    });
    fixture = TestBed.createComponent(CreateAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
