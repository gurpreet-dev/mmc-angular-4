import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionWinComponent } from './auction-win.component';

describe('AuctionWinComponent', () => {
  let component: AuctionWinComponent;
  let fixture: ComponentFixture<AuctionWinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionWinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
