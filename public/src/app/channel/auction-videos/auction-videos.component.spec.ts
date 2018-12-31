import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionVideosComponent } from './auction-videos.component';

describe('AuctionVideosComponent', () => {
  let component: AuctionVideosComponent;
  let fixture: ComponentFixture<AuctionVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
