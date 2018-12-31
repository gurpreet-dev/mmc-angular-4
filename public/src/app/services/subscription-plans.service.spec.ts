import { TestBed, inject } from '@angular/core/testing';

import { SubscriptionPlansService } from './subscription-plans.service';

describe('SubscriptionPlansService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionPlansService]
    });
  });

  it('should be created', inject([SubscriptionPlansService], (service: SubscriptionPlansService) => {
    expect(service).toBeTruthy();
  }));
});
