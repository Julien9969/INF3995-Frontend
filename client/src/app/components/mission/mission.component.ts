import {Component, Input, OnChanges} from '@angular/core';
import {MatCard, MatCardContent, MatCardModule} from "@angular/material/card";
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
import {MapViewComponent} from "@app/components/map-view/map-view.component";
import {MissionState, MissionStatus} from '@app/classes/mission-status';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {formatCounter} from "@app/classes/utils";
import {BehaviorSubject} from "rxjs";
import {MissionService} from "@app/services/mission/mission.service";
import {MatDialogTitle} from "@angular/material/dialog";
import {RobotInformation} from "@app/services/robots/robots.service";

interface RobotData {
  id: number,
  distance: number;
  battery: number;
  state: string;
}

interface MissionInfo {
  missionId: number;
  elapsedTime: string;
  timestamp: number;
  simulation: boolean;

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
    MatHeaderCellDef,
    MatRow,
    MatRowDef,
    MatTable, MatDialogTitle,
  ],
  selector: 'app-mission',
  standalone: true,
  styleUrl: './mission.component.scss',
  templateUrl: './mission.component.html'
})
export class MissionComponent implements OnChanges {
  @Input() missionState: MissionState = MissionState.NOT_STARTED;
  @Input() robots: BehaviorSubject<RobotInformation[]> = new BehaviorSubject<RobotInformation[]>([] as RobotInformation[]);
  @Input() status: BehaviorSubject<MissionStatus> = new BehaviorSubject<MissionStatus>({} as MissionStatus);
  robotDisplayedColumns: string[] = ['id', 'state', 'distance', 'battery', 'identify'];
  robotDataSource = new MatTableDataSource();
  elapsedTime: string = '0:00:00';
  missionStartedAt: number = 0;
  missionId: number = 0;
  distance: number = 0;
  protected readonly MissionState = MissionState;
  isSimulation: boolean = false;
  displayedColumns: string[] = ["missionId", "elapsedTime", "timestamp", "simulation"];
  rowData: MissionInfo = {} as MissionInfo;
  infoDataSource = new MatTableDataSource([this.rowData])

  constructor(private matSnackBar: MatSnackBar,
              private missionService: MissionService,) {
  }


  ngOnChanges() {
    this.status.subscribe((updatedStatus) => {
      if(updatedStatus) {
        this.elapsedTime = formatCounter(updatedStatus.elapsedTime)
        this.missionStartedAt = updatedStatus.startTimestamp * 1000
        this.rowData = {
          missionId: this.missionId,
          elapsedTime: this.elapsedTime,
          timestamp: this.missionStartedAt,
          simulation: this.isSimulation
        }
        this.infoDataSource.data = [this.rowData]
      }
    });

    this.robots.subscribe((updatedRobots) => {
      const newRobotLogs: RobotData[] = []
      for (let i = 0; i < updatedRobots.length; i++) {
        const newRobotData: RobotData = {
          id: i + 1,
          battery: Math.round(Math.random() * 100),
          distance: this.distance,
          state: 'IDLE'
        }
        newRobotLogs.push(newRobotData)
      }
      this.robotDataSource.data = newRobotLogs
    });
  }

  openSnackBar(robotId: number) {
    this.matSnackBar.open(`Robot ${robotId} s'est identifié!`, 'Fermer', {
      duration: 2000,
    });
  }

  identifyRobots(robotId: number) {
    this.missionService.identify(robotId).subscribe(() => this.openSnackBar(robotId));
  }
}
