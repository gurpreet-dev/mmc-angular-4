import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelLayoutComponent } from './channel-layout.component';

describe('ChannelLayoutComponent', () => {
  let component: ChannelLayoutComponent;
  let fixture: ComponentFixture<ChannelLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
