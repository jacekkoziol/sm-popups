import { TestBed, inject } from '@angular/core/testing';
import { SmToOverlayService } from './sm-to-overlay.service';

describe('SmToOverlayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmToOverlayService]
    });
  });

  it('should ...', inject([SmToOverlayService], (service: SmToOverlayService) => {
    expect(service).toBeTruthy();
  }));
});
