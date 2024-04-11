import {MissionService} from "@app/services/mission/mission.service";
import {inject} from "@angular/core";
import {MissionState} from "@common";
import {MissionViewComponent} from "@app/pages/mission-view/mission-view.component";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

export const missionRunningGuard = (missionViewComponent: MissionViewComponent, currentRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot, routerNextState: RouterStateSnapshot) => {
  const missionService = inject(MissionService);
  return new Promise((resolve) => {
    // always allow redirect to error page
    if(routerNextState.url == "error") {
      resolve(false);
      return;
    }
    // If mission-view is not ongoing, we don't care
    if (missionService.status.getValue().missionState != MissionState.ONGOING) {
      resolve(true);
      return;
    }

    if(missionService.shouldDisconnect) {
      missionService.shouldDisconnect = false;
      resolve(true);
      return;
    }
    // else confirm with user
    missionViewComponent.openDialog().subscribe((result) => {
      if (result) {
        resolve(true);
        missionService.toggleMission();
      } else {
        resolve(false);
      }
    });
  });
};
