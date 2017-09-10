import { TestBed, inject } from '@angular/core/testing';

import { EmailExportService } from './email-export.service';

describe('EmailExportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailExportService]
    });
  });

  it('should be created', inject([EmailExportService], (service: EmailExportService) => {
    expect(service).toBeTruthy();
  }));
});
