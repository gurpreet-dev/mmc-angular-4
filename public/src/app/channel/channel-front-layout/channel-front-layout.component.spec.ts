import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelFrontLayoutComponent } from './channel-front-layout.component';

describe('ChannelFrontLayoutComponent', () => {
  let component: ChannelFrontLayoutComponent;
  let fixture: ComponentFixture<ChannelFrontLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelFrontLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelFrontLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
