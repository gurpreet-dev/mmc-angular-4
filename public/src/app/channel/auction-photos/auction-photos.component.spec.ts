import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPhotosComponent } from './auction-photos.component';

describe('AuctionPhotosComponent', () => {
  let component: AuctionPhotosComponent;
  let fixture: ComponentFixture<AuctionPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
