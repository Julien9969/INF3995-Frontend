import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MissionService} from '@app/services/mission/mission.service';
import {ActivatedRoute} from "@angular/router";
import {HistoryService} from "@app/services/history/history.service";

interface RobotData {
  id: number,
  distance: number;
  battery: number;
}

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
  ],
  templateUrl: './mission-view.component.html',
  styleUrl: './mission-view.component.scss'
})
export class MissionViewComponent implements OnInit {
  missionId: string = "";

  constructor(private route: ActivatedRoute,
              private historyService: HistoryService) {
    this.route.queryParams.subscribe(params => {
      this.missionId = params['missionId'];
    });
  }

  ngOnInit() {
    console.log("Mission ID", this.missionId);
  }
}
