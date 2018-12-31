import { TestBed, inject } from '@angular/core/testing';

import { VideoCategoryService } from './video-category.service';

describe('VideoCategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoCategoryService]
    });
  });

  it('should be created', inject([VideoCategoryService], (service: VideoCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
