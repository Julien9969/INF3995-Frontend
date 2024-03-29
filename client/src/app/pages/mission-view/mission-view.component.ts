import {Component, inject, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTable, MatTableModule} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
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
  MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatToolbar} from "@angular/material/toolbar";
import {MissionComponent} from "@app/components/mission/mission.component";
import {MissionState} from "@app/classes/mission-status";
import {MatTooltip} from "@angular/material/tooltip";


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
export class MissionViewComponent implements OnInit {
  missionId: number;
  isTimeMachine: boolean = false;
  private route = inject(ActivatedRoute);
  private _logs: BehaviorSubject<Logs[]> = new BehaviorSubject<Logs[]>([]);
  private _map: BehaviorSubject<HTMLImageElement> = new BehaviorSubject<HTMLImageElement>(new Image());
  isLoading: boolean = false;
  previousMissionState: MissionState = MissionState.NOT_STARTED;
  identifyRobotTooltip: string = 'Ramener les robots à la base';
  missionState: MissionState = MissionState.NOT_STARTED;

  constructor(private historyService: HistoryService,
              private missionService: MissionService,
              private logsService: LogsService,
              private mapService: MapService) {
      this.missionId = Number(this.route.snapshot.paramMap.get("id")) || 0;
      this.isTimeMachine = this.missionId !== 0;
  }

  toggleMission() {
    this.missionService.toggleMission()
    this.previousMissionState = this.missionState
    this.isLoading = true
  }

  ngOnInit() {
    if(this.isTimeMachine) {
      this._logs = this.historyService.getLogs(this.missionId);
      this._map = this.historyService.getMap(this.missionId);
    } else {
      this._logs = this.logsService.logs;
      this._map = this.mapService.image;
      this.missionService.status.subscribe((updatedStatus) => {
        this.missionState = updatedStatus.missionState;
        this.isLoading = updatedStatus.missionState !== this.missionState;
      });
    }
  }

  get logs() {
    return this._logs;
  }

  get map() {
    return this._map;
  }

  protected readonly MissionState = MissionState;
}
