import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberLayoutComponent } from './subscriber-layout.component';

describe('SubscriberLayoutComponent', () => {
  let component: SubscriberLayoutComponent;
  let fixture: ComponentFixture<SubscriberLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
