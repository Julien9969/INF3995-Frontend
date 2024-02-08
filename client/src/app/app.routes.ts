import { Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {CartesComponent} from "./pages/cartes/cartes.component";
import {MissionComponent} from "@app/pages/mission/mission.component";
import {IdeComponent} from "./pages/ide/ide.component";
import {LogsComponent} from "./pages/logs/logs.component";

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'mission', component: MissionComponent},
  { path: 'cartes', component: CartesComponent},
  { path: 'ide', component: IdeComponent},
  { path: 'logs', component: LogsComponent},
  { path: 'dashboard', component: DashboardComponent},
];
