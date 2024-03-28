import {Routes} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {MissionComponent} from "@app/pages/mission/mission.component";
import {IdeComponent} from "./pages/ide/ide.component";
import {HistoryComponent} from "@app/pages/history/history.component";
import {ErrorComponent} from "@app/pages/error/error.component";

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: DashboardComponent},
  {path: 'mission', component: MissionComponent},
  {path: 'ide', component: IdeComponent},
  {path: 'history', component: HistoryComponent},
  {path: 'error', component: ErrorComponent}
];
