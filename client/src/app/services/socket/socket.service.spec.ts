import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import {Socket} from "socket.io-client";
import {SocketMock} from "@app/classes/helpers/socket-mock-helper";

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    /*
    io is an imported function and can't be spied upon with Jasmine
    Issue : https://github.com/jasmine/jasmine/issues/1414
    */
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketService);
    service['socketClient'] = new SocketMock() as unknown as Socket;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should join', () => {
    const roomId = '1';
    const emitSpy = spyOn(service['socketClient'], 'emit');
    service.join(roomId);
    expect(emitSpy).toHaveBeenCalledWith('joinRoom', roomId);
  });

  it('should call socket.on with the correct parameters', () => {
    const event = 'event';
    const action = () => {};
    const socktOnSpy = spyOn(service['socketClient'], 'on');
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    service.on(event, action);
    expect(socktOnSpy).toHaveBeenCalledWith(event, action);
  });

  it('should emit with the correct', () => {
    const event = 'event';
    const message = 'message';
    const emitSpy = spyOn(service['socketClient'], 'emit');
    service.send(event, message);
    expect(emitSpy).toHaveBeenCalledWith(event, message);
    service.send(event);
    expect(emitSpy).toHaveBeenCalledWith(event);
  });
});
