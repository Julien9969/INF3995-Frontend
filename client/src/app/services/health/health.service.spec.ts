import {TestBed} from '@angular/core/testing';

import {HealthService} from './health.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '@environment';

const LOCAL_URL = `${environment.serverUrl}api/ping/`;

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be ok', async () => {
    service.check.subscribe((value) => {
      console.error("SUBSCRIBED!")
      expect(value).toBe(true);
    });
    jasmine.clock().install()
    service.configureTimer();
    const request = httpMock.expectOne(LOCAL_URL);
    request.flush('pong');
    jasmine.clock().tick(1000);
  });

});
