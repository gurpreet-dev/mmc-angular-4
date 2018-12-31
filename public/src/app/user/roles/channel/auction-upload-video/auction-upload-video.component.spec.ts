import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionUploadVideoComponent } from './auction-upload-video.component';

describe('AuctionUploadVideoComponent', () => {
  let component: AuctionUploadVideoComponent;
  let fixture: ComponentFixture<AuctionUploadVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionUploadVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionUploadVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
