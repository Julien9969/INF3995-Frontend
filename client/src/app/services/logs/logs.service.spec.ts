import { TestBed } from '@angular/core/testing';

import { LogsService } from './logs.service';
import {SocketService} from "@app/services/socket/socket.service";
import {Logs} from "@app/classes/logs";

describe('LogsService', () => {
  let service: LogsService;
  let socketServiceSpyObj: jasmine.SpyObj<SocketService>;
  beforeEach(() => {
    socketServiceSpyObj = jasmine.createSpyObj('SocketService', ['on']);
    const callback = (event: string, action: (Param: any) => void) => {
      action("{}")
    }
    socketServiceSpyObj.on.and.callFake(callback);
    TestBed.configureTestingModule({
      providers: [
        {provide: SocketService, useValue: socketServiceSpyObj}
      ]
    });
    service = TestBed.inject(LogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should save logs", async () => {
    const log: Logs = {eventType: 'log', robotId: 1, message: 'test', timestamp: 1};
    const jsonLog = JSON.stringify(log);
    service.logs.subscribe((logs) => {
      expect(logs).toEqual([log]);
    });
    service['saveLog'](jsonLog);
  });

  it("should save logs", async () => {
    const log: Logs = {eventType: 'battery', robotId: 4, message: '99', timestamp: 1};
    const jsonLog = JSON.stringify(log);
    service['saveLog'](jsonLog);
    const map = new Map<number, number>();
    map.set(4, 99);
    expect(service['_batteries'].getValue()).toEqual(map);
  });

  it("should return batteries", async () => {
    const map = new Map<number, number>();
    map.set(4, 99);
    service['_batteries'].next(map);
    service.batteries.subscribe((batteries) => {
      expect(batteries).toEqual(map);
    });
  });
});
