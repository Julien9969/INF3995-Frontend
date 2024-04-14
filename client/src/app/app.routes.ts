import {Routes} from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {IdeComponent} from "./pages/ide/ide.component";
import {HistoryComponent} from "@app/pages/history/history.component";
import {MissionViewComponent} from "@app/pages/mission-view/mission-view.component";

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: DashboardComponent},
  {path: 'mission/:id', component: MissionViewComponent},
  {path: 'mission', component: MissionViewComponent},
  {path: 'ide', component: IdeComponent},
  {path: 'history', component: HistoryComponent},
];
