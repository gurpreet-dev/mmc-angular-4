import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPaymentStatusComponent } from './auction-payment-status.component';

describe('AuctionPaymentStatusComponent', () => {
  let component: AuctionPaymentStatusComponent;
  let fixture: ComponentFixture<AuctionPaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionPaymentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
