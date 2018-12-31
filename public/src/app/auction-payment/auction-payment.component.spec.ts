import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPaymentComponent } from './auction-payment.component';

describe('AuctionPaymentComponent', () => {
  let component: AuctionPaymentComponent;
  let fixture: ComponentFixture<AuctionPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
