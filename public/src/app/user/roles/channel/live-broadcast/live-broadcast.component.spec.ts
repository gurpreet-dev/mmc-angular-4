import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBroadcastComponent } from './live-broadcast.component';

describe('LiveBroadcastComponent', () => {
  let component: LiveBroadcastComponent;
  let fixture: ComponentFixture<LiveBroadcastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveBroadcastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveBroadcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
