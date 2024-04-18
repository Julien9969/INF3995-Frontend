import {TestBed} from '@angular/core/testing';

import {HealthService} from './health.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '@environment';
import {SocketService} from "@app/services/socket/socket.service";
import {WebsocketsEvents} from "@common";

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;
  let socketServiceSpyObj: jasmine.SpyObj<SocketService>;

  beforeEach(() => {
    socketServiceSpyObj = jasmine.createSpyObj('SocketService', ['send', 'on']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: SocketService, useValue: socketServiceSpyObj},
      ]
    });
    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be ok', (done) => {
    setInterval(() => {
      expect(socketServiceSpyObj.send).toHaveBeenCalledWith(WebsocketsEvents.PING)
    }, 1001);
    done();
  });

});
