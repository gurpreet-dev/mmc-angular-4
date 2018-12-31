import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionUploadImageComponent } from './auction-upload-image.component';

describe('AuctionUploadImageComponent', () => {
  let component: AuctionUploadImageComponent;
  let fixture: ComponentFixture<AuctionUploadImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionUploadImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionUploadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
