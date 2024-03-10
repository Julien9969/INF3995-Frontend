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
import {NgForOf, NgIf } from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from '@angular/router';
import {HealthService} from "@app/services/health/health.service";
import {MissionDetailsComponent} from "@app/components/mission-details/mission-details.component";
import { MissionState } from '@app/classes/mission-status';
import { SocketService } from '@app/services/socket/socket.service';

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
  missionInitialized: boolean = false; // Should display the little banner of not
  ongoingMission: boolean = false;
  constructor(public missionService: MissionService,
              public socketService: SocketService,
              private readonly healthService: HealthService,
              private router: Router) {
  }

  ngOnInit() {
    // Unreachable server
    this.healthService.isServerOk().catch(async () => this.router.navigate(['/error']));

    this.missionService.status.subscribe((updatedStatus) => {
      if(!this.missionInitialized && updatedStatus.missionState == MissionState.ONGOING) {
        this.missionInitialized = true;
      }
    })
  }

  toggleMission () {
    this.missionService.toggleMission()
  }

  identifyRobots(robotId: number) {
    this.missionService.identify(robotId).subscribe(response => console.log(response));
  }

  get batteries(): number[] {
    return this.missionService.status.getValue().batteries;
  }
}
