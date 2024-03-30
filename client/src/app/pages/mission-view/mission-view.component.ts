import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTable, MatTableModule} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {HistoryService} from "@app/services/history/history.service";
import {MissionService} from "@app/services/mission/mission.service";
import {LogsService} from "@app/services/logs/logs.service";
import {MapService} from "@app/services/map/map.service";
import {BehaviorSubject} from "rxjs";
import {Logs} from "@app/classes/logs";
import {LogsComponent} from "@app/components/logs/logs.component";
import {MapViewComponent} from "@app/components/map-view/map-view.component";
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatToolbar} from "@angular/material/toolbar";
import {MissionComponent} from "@app/components/mission/mission.component";
import {MissionState, MissionStatus} from "@app/classes/mission-status";
import {MatTooltip} from "@angular/material/tooltip";
import {HealthService} from "@app/services/health/health.service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialogComponent} from "@app/components/confirmation-dialog/confirmation-dialog.component";


@Component({
  selector: 'app-mission-view',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    NgForOf,
    MatCardActions,
    MatButton,
    MatIconButton,
    MatIconModule,
    MatTable,
    MatTableModule,
    DatePipe,
    LogsComponent,
    MapViewComponent,
    MatExpansionPanel,
    MatExpansionPanelContent,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinner,
    MatToolbar,
    NgIf,
    MissionComponent,
    MatTooltip,
  ],
  templateUrl: './mission-view.component.html',
  styleUrl: './mission-view.component.scss'
})
export class MissionViewComponent implements OnInit, OnDestroy {
  missionId: number = 0;
  isTimeMachine: boolean = false;
  logs: BehaviorSubject<Logs[]> = new BehaviorSubject<Logs[]>([]);
  map: BehaviorSubject<HTMLImageElement> = new BehaviorSubject<HTMLImageElement>(new Image());
  status: BehaviorSubject<MissionStatus> = new BehaviorSubject<MissionStatus>({
    missionState: MissionState.NOT_STARTED,
    startTimestamp: 0,
    elapsedTime: 0,
    count: 0,
    batteries: [],
    distances: []
  });
  isLoading: boolean = false;
  previousMissionState: MissionState = MissionState.NOT_STARTED;
  identifyRobotTooltip: string = 'Ramener les robots à la base';
  missionState: MissionState = MissionState.NOT_STARTED;
  protected readonly MissionState = MissionState;
  private route = inject(ActivatedRoute);

  constructor(private historyService: HistoryService,
              private missionService: MissionService,
              private logsService: LogsService,
              private mapService: MapService,
              private healthService: HealthService,
              private router: Router,
              public dialog: MatDialog
  ) {

  }

  toggleMission() {
    this.missionService.toggleMission()
    this.previousMissionState = this.missionState
    this.isLoading = true
  }

  ngOnInit() {
    this.missionId = Number(this.route.snapshot.paramMap.get("id")) || 0;
    if (this.missionId !== 0) {
      const historyData = this.historyService.getMissions().getValue().find(mission => mission.id === this.missionId);
      this.isTimeMachine = historyData !== undefined; // Check if id is in history
    } else {
      this.isTimeMachine = false;
    }
    /*if (!this.healthService.check.getValue()) {
      this.router.navigate(['/error']).then(() => {});
    }*/
    if (this.isTimeMachine) {
      this.logs = this.historyService.getLogs(this.missionId);
      this.map = this.historyService.getMap(this.missionId);
      this.status = this.historyService.getStatus(this.missionId);
    } else {
      this.logs = this.logsService.logs;
      this.map = this.mapService.image;
      this.status = this.missionService.status;
      this.status.subscribe((updatedStatus) => {
        this.missionState = updatedStatus.missionState;
        this.isLoading = updatedStatus.missionState !== this.missionState;
      });
    }
  }

  openDialog() {
    return this.dialog.open(ConfirmationDialogComponent).afterClosed();
  }

  ngOnDestroy() {
    this.missionService.disconnect();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload() {
    this.openDialog()
  }
}
