import {Component, OnInit} from '@angular/core';
import {MatCardContent, MatCardModule} from "@angular/material/card";
import {MissionService} from "@app/services/mission/mission.service";
import {MatDivider} from "@angular/material/divider";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {NgForOf, NgIf} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from '@angular/router';
import {HealthService} from "@app/services/health/health.service";
import {MissionDetailsComponent} from "@app/components/mission-details/mission-details.component";

@Component({
  imports: [MatCardModule,
    MatDivider,
    MatButton,
    MatIcon,
    MatIconButton,
    LogsComponent,
    MatGridList,
    MatGridTile,
    MatCardContent,
    MatToolbar,
    MatMenuModule,
    MatMenuTrigger,
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanel,
    MatExpansionPanelTitle, NgForOf, MatPaginator, NgIf, MissionDetailsComponent],
  selector: 'app-mission',
  standalone: true,
  styleUrl: './mission.component.scss',
  templateUrl: './mission.component.html'
})
export class MissionComponent implements OnInit {
  ongoingMission = true;

  constructor(private missionService: MissionService,
              private readonly healthService: HealthService,
              private router: Router) {
  }

  // TODO: retrieve robot info

  ngOnInit() {
    this.healthService.isServerOk().catch(async () => this.router.navigate(['/error']));
  }

  toggleMission() {
    this.ongoingMission = !this.ongoingMission;
  }

}
