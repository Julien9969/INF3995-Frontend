import { TestBed } from '@angular/core/testing';

import { LogsService } from './logs.service';
import {SocketService} from "@app/services/socket/socket.service";

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
    service.logs.subscribe((logs) => {
      expect(logs.length).toBe(1);
    });
    service['saveLog']("test");
  });
});
