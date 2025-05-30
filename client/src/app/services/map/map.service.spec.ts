import {TestBed} from '@angular/core/testing';

import {MapService} from './map.service';
import {SocketService} from "@app/services/socket/socket.service";
import {SocketMock} from "@app/helpers/socket-mock-helper";
import {BehaviorSubject} from "rxjs";

describe('MapService', () => {
  let service: MapService;
  let socketClient: SocketMock;
  let socketServiceSpyObj: jasmine.SpyObj<SocketService>;
  let imageSubjectSpy: jasmine.Spy;

  beforeEach(() => {
    socketClient = new SocketMock();
    socketServiceSpyObj = jasmine.createSpyObj('SocketService', ['on'], {socketClient});
    const callback = (event: string, action: (Param: any) => void) => {
      action("data:image/bmp;base64,1234567890")
    }
    socketServiceSpyObj.on.and.callFake(callback);
    TestBed.configureTestingModule({
      providers: [
        {provide: SocketService, useValue: socketServiceSpyObj},
      ]
    });
    service = TestBed.inject(MapService);
    imageSubjectSpy = spyOn(service['imageSubject'], 'next');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have image', () => {
    expect(service.image).toBeTruthy();
  });

  it('should call the callback function', () => {
    socketClient.triggerEndpoint('map-data', "data:image/bmp;base64,1234567890");
    expect(socketServiceSpyObj['on']).toHaveBeenCalled();
  });

  it('should return an behavior subject', () => {
    expect(service.image).toBeInstanceOf(BehaviorSubject);
  });

  it('should receive a base64 image', () => {
    const imageBase64 = "data:image/png;base64,wtv"
    service.loadImage(imageBase64)
    expect(service['imageSubject'].getValue().src).not.toBe(imageBase64);
  });

  it('should not receive a base64 image', () => {
    const imageBase64 = "invalid"
    service.loadImage(imageBase64)
    expect(service['imageSubject'].getValue().src).not.toBe(imageBase64);
  });

});
