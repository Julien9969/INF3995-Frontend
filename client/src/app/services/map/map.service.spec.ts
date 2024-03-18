import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {MapService} from './map.service';
import {SocketService} from "@app/services/socket/socket.service";
import {SocketMock} from "@app/classes/helpers/socket-mock-helper";
import {BehaviorSubject} from "rxjs";

describe('MapService', () => {
  let service: MapService;
  let socketClient: SocketMock;
  let socketServiceSpyObj: jasmine.SpyObj<SocketService>;
  let imageSpyObj: jasmine.SpyObj<HTMLImageElement>;

  beforeEach(() => {
    socketClient = new SocketMock();
    socketServiceSpyObj = jasmine.createSpyObj('SocketService', ['on'], {socketClient});
    imageSpyObj = jasmine.createSpyObj('HTMLImageElement', ['onload']);
    const callback = (event: string, action: (Param: any) => void) => {
      action("data:image/bmp;base64,1234567890")
    };
    socketServiceSpyObj.on.and.callFake(callback);
    TestBed.configureTestingModule({
      providers: [
        {provide: SocketService, useValue: socketServiceSpyObj},
        {provide: HTMLImageElement, useValue: imageSpyObj}
      ]
    });
    service = TestBed.inject(MapService);
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

  it('should notify the observers', fakeAsync(() => {
    const imageBase64 = "data:image/png;base64,wtv"
    service.loadImage(imageBase64);
    tick(100);
    expect(service.image.getValue()).toBeInstanceOf(HTMLImageElement);
    expect(service.image.getValue().src).toBe(imageBase64);
  }));
});
