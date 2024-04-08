import {TestBed} from '@angular/core/testing';
import {RobotsService} from './robots.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {WebsocketsEvents} from "@common";
import {SocketService} from "@app/services/socket/socket.service";
import {environmentExt} from "@environment-ext";

const localUrl = (call: string) => `${environmentExt.apiUrl}identify/${call}`;



describe('RobotsService', () => {
  let service: RobotsService;
  let socketServiceObj: jasmine.SpyObj<SocketService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    socketServiceObj = jasmine.createSpyObj('SocketService', ['on', 'send'], {});
    const robots = [
      {
        id: 1,
        name: "Robot 1",
        battery: 100,
        state: "Idle",
        lastUpdate: 0,
        distance: 0,
        initialPosition: {
          x: 0,
          y: 0
        },
        position: {
          x: 0,
          y: 0
        }
      }
    ];
    const callback = (event: string, action: (Param: any) => void) => {
      action(JSON.stringify(robots));
    }
    socketServiceObj.on.and.callFake(callback);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SocketService, useValue: socketServiceObj},
      ]
    });
    service = TestBed.inject(RobotsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should identify robot", async () => {
    const robotId = 1;
    const response = {
      timestamp: 0,
      message: "Identified",
      robotId: robotId
    }
    service.identify(robotId);
    const request = httpMock.expectOne(localUrl(robotId.toString()));
    request.flush(response);
    service['_identify'].subscribe((response) => {
      expect(response.robotId).toEqual(robotId);
    });
  });

  it("should head to position", async () => {
    service.headBackBase();
    expect(socketServiceObj.send).toHaveBeenCalledWith(WebsocketsEvents.HEADBACKBASE_REQUEST);
  });

  it("should return robots", () => {
    service.robots.subscribe((robots) => {
      expect(robots.length).toEqual(1);
    });
  });
});
