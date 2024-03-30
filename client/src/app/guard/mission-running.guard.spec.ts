import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { missionRunningGuard } from './mission-running.guard';

describe('missionRunningGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => missionRunningGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
