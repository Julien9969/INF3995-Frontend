import { TestBed } from '@angular/core/testing';

import { QuitPopupService } from './quit-popup.service';

describe('QuitPopupService', () => {
  let service: QuitPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuitPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
