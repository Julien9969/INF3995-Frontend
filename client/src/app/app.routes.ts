import {Routes} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {IdeComponent} from "./pages/ide/ide.component";
import {HistoryComponent} from "@app/pages/history/history.component";
import {ErrorComponent} from "@app/pages/error/error.component";
import {MissionViewComponent} from "@app/pages/mission-view/mission-view.component";
import {missionRunningGuard} from "@app/guard/mission-running.guard";

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: DashboardComponent},
  {
    path: 'mission', component: MissionViewComponent, canDeactivate: [missionRunningGuard], children:
      [
        {path: ':id', component: MissionViewComponent, canDeactivate: [missionRunningGuard]}
      ]
  },
  {path: 'ide', component: IdeComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'error', component: ErrorComponent}
];
