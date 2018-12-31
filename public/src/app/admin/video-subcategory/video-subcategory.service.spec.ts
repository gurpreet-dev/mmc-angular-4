import { TestBed, inject } from '@angular/core/testing';

import { VideoSubcategoryService } from './video-subcategory.service';

describe('VideoSubcategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoSubcategoryService]
    });
  });

  it('should be created', inject([VideoSubcategoryService], (service: VideoSubcategoryService) => {
    expect(service).toBeTruthy();
  }));
});
