import {TestBed} from '@angular/core/testing';
import {RobotsService} from './robots.service';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {BehaviorSubject} from "rxjs";
import {WebsocketsEvents} from "@common";
import {SocketService} from "@app/services/socket/socket.service";
import {SocketMock} from "@app/helpers/socket-mock-helper";
import {environmentExt} from "@environment-ext";



describe('RobotsService', () => {
  let service: RobotsService;
  let socketClient: SocketMock = new SocketMock();
  let onSpy = jasmine.createSpy('on');
  let socketServiceObj = {
    socketClient: socketClient,
    on: onSpy,
    send: jasmine.createSpy()
  };
  let httpSpyObj: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpyObj = jasmine.createSpyObj('HttpClient', ['get', 'pipe']);
    httpSpyObj.get.and.returnValue(new BehaviorSubject<string>(""));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SocketService, useValue: socketServiceObj},
      ]
    });
    service = TestBed.inject(RobotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
