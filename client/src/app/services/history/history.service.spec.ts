import {TestBed} from '@angular/core/testing';

import {HistoryService} from './history.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

fdescribe('HistoryService', () => {
  let service: HistoryService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dataObservable: BehaviorSubject<unknown> = new BehaviorSubject<unknown>([])
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', {get: dataObservable.asObservable()});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: HttpClientModule, useValue: httpClientSpy},
      ]
    });
    service = TestBed.inject(HistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return missions', () => {
    const result = service.getMissions()
    dataObservable.next([{}])
    expect(result).toBeTruthy();
  });

  it('should return logs', () => {
    const result = service.getLogs(1)
    dataObservable.next([{}])
    expect(result).toBeTruthy();
  });

  it('should return map', () => {
    const result = service.getMap(1)
    dataObservable.next([{}])
    expect(result).toBeTruthy();
  });

  it('should return status', () => {
    const result = service.getStatus(1)
    dataObservable.next([{}])
    expect(result).toBeTruthy();
  });

  it('should return robots', () => {
    const result = service.getRobots(3)
    dataObservable.next([{}])
    expect(result).toBeTruthy();
  });
});
