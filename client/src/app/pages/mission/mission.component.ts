import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardModule} from "@angular/material/card";
import {MissionService} from "@app/services/mission/mission.service";
import {MatDivider} from "@angular/material/divider";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatAccordion, MatExpansionModule, MatExpansionPanel} from "@angular/material/expansion";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from '@angular/router';
import {HealthService} from "@app/services/health/health.service";
import {MapViewComponent} from "@app/components/map-view/map-view.component";
import {MissionState} from '@app/classes/mission-status';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {formatCounter} from "@app/classes/utils";

interface RobotData {
  id: number,
  distance: number;
  battery: number;
}

@Component({
  imports: [MatCardModule,
    MatCard,
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
    MapViewComponent,
    NgForOf,
    MatPaginator,
    NgIf,
    MatTooltip,
    MatProgressSpinner,
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
  ],
  selector: 'app-mission',
  standalone: true,
  styleUrl: './mission.component.scss',
  templateUrl: './mission.component.html'
})
export class MissionComponent implements OnInit {
  missionState: MissionState = MissionState.NOT_STARTED;
  previousMissionState: MissionState = MissionState.NOT_STARTED;
  identifyRobotTooltip: string = 'Ramener les robots à la base';
  robotDisplayedColumns: string[] = ['id', 'state', 'distance', 'battery', 'identify'];
  robotDataSource: MatTableDataSource<RobotData> = new MatTableDataSource();
  elapsedTime: string = '0:00:00';
  missionStartedAt: number = 0;
  missionId: number = 0;
  distance: number = 0;
  isLoading: boolean = false;
  protected readonly MissionState = MissionState;

  constructor(public missionService: MissionService,
              private healthService: HealthService,
              private router: Router,
              private matSnackBar: MatSnackBar) {
    this.missionService.status.subscribe((updatedStatus) => {
      this.elapsedTime = formatCounter(updatedStatus.elapsedTime)
      this.missionStartedAt = updatedStatus.startTimestamp * 1000
      this.robotDataSource.data = [];
      const newRobotLogs: RobotData[] = []
      for (let i = 0; i < updatedStatus.batteries.length; i++) {
        const newRobotData: RobotData = {
          id: i + 1,
          battery: Math.round(Math.random() * 100),
          distance: this.distance,
        }
        newRobotLogs.push(newRobotData)
        this.robotDataSource.data = newRobotLogs
      }
    });
    this.distance = this.distance + 0.01;
  }

  get batteries(): number[] {
    return this.missionService.status.getValue().batteries;
  }

  ngOnInit() {
    // Unreachable server
    this.healthService.check.subscribe((connected) => {
      if (connected) {
        this.router.navigate(['/error'])
      }
    });

    this.missionService.status.subscribe((updatedStatus) => {
      this.missionState = updatedStatus.missionState;
      this.isLoading = updatedStatus.missionState !== this.missionState;
    });
  }

  toggleMission() {
    this.missionService.toggleMission()
    this.previousMissionState = this.missionState
    this.isLoading = true
  }

  openSnackBar(robotId: number) {
    this.matSnackBar.open(`Robot ${robotId} s'est identifié!`, 'Close', {
      duration: 2000,
    });
  }

  identifyRobots(robotId: number) {
    this.missionService.identify(robotId).subscribe(() => this.openSnackBar(robotId));
  }
}
