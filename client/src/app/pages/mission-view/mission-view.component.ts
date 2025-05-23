import {Component, inject, OnInit} from '@angular/core';
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
import {EmitFeedback, HealthState, Logs, MissionState, MissionStatus, RobotInformation} from "@common";
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
import {MatTooltip} from "@angular/material/tooltip";
import {HealthService} from "@app/services/health/health.service";
import {MatDialog} from "@angular/material/dialog";
import {RobotsService} from "@app/services/robots/robots.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RobotsViewComponent} from "@app/components/robots-view/robots-view.component";


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
    RobotsViewComponent,
  ],
  templateUrl: './mission-view.component.html',
  styleUrl: './mission-view.component.scss'
})
export class MissionViewComponent implements OnInit {
  missionId: number = 0;
  isTimeMachine: boolean = false;

  robots: BehaviorSubject<RobotInformation[]> = new BehaviorSubject<RobotInformation[]>([]);
  logs: BehaviorSubject<Logs[]> = new BehaviorSubject<Logs[]>([]);
  map: BehaviorSubject<HTMLImageElement> = new BehaviorSubject<HTMLImageElement>(new Image());
  status: BehaviorSubject<MissionStatus> = new BehaviorSubject<MissionStatus>({} as MissionStatus);

  isLoading: boolean = false;
  previousMissionState: MissionState = MissionState.NOT_STARTED;
  missionState: MissionState = MissionState.NOT_STARTED;
  mapInitialized: boolean = false;
  protected readonly MissionState = MissionState;
  private route = inject(ActivatedRoute);

  constructor(private historyService: HistoryService,
              private missionService: MissionService,
              private logsService: LogsService,
              private mapService: MapService,
              private robotsService: RobotsService,
              private healthService: HealthService,
              private router: Router,
              public matSnackBar: MatSnackBar,
              public dialog: MatDialog
  ) {
  }

  openSnackBar(message: string) {
    this.matSnackBar.open(message, 'Fermer', {
      duration: 4000,
    });
  }

  toggleMission() {
    this.missionService.toggleMission()
    this.previousMissionState = this.missionState
    this.isLoading = true
  }

  toggleHeadBackBase() {
    if (this.missionState === MissionState.ONGOING) {
      this.openSnackBar("Requête de ramener les robots à la base envoyée")
    } else {
      this.openSnackBar('La mission doit être en cours pour pouvoir renvoyer les robots à la base.')
    }
    this.robotsService.headBackBase().subscribe((result: EmitFeedback) => this.openSnackBar(result.message));
  }

  ngOnInit() {
    this.isLoading = true;
    this.robotsService.checkConnection();
    this.healthService.check.subscribe((status: HealthState) => {
      if (status === HealthState.UNHEALTHY) {
        this.isLoading = false;
        this.openSnackBar("Serveur non disponible!");
      } else if (status === HealthState.UNKNOWN) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });

    this.missionId = Number(this.route.snapshot.paramMap.get("id")) || 0;
    if (this.missionId !== 0) {
      let historyData = undefined;
      this.historyService.getMissions().subscribe((missions) => {
        historyData = missions.find(mission => mission.missionId === this.missionId);
        if (historyData === undefined) {
          const errorMessage = "Mission non trouvée!"
          this.router.navigate(['/error'], {state: {errorMessage: errorMessage}}).then(() => {
          });
          return;
        }
      });
    }
    this.isTimeMachine = this.missionId !== 0;
    this.loadData(this.isTimeMachine)
  }

  loadData(isTimeMachine: boolean) {
    if (isTimeMachine) {
      this.logs = this.historyService.getLogs(this.missionId);
      this.map = this.historyService.getMap(this.missionId);
      this.mapInitialized = true;
      this.status = this.historyService.getStatus(this.missionId);
      this.robots = this.historyService.getRobots(this.missionId);
      this.missionState = MissionState.ENDED;
    } else {
      this.logs = this.logsService.logs;
      this.map = this.mapService.image;
      this.map.subscribe(() => {
        this.mapInitialized = !this.mapService.isDefaultMap;
      })
      this.robots = this.robotsService.robots
      this.status = this.missionService.status;
      this.status.subscribe((updatedStatus) => {
        this.missionState = updatedStatus.missionState;
        this.isLoading = updatedStatus.missionState !== this.missionState;
      });
    }
  }
}
