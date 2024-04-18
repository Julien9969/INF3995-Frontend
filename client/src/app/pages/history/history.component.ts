import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatCard} from "@angular/material/card";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {HistoryService} from "@app/services/history/history.service";
import {DatePipe, DecimalPipe, NgIf} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {MatDivider} from "@angular/material/divider";
import {MissionStatus} from "@common";


export interface HistoryData {
  id: number,
  startTimestamp: number,
  duration: number,
  distance: number,
  nbRobots: number,
  simulation: boolean,
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    LogsComponent,
    MatPaginator,
    MatCard,
    MatTableModule,
    MatIconButton,
    MatButton,
    MatIcon,
    DatePipe,
    NgIf,
    MatToolbar,
    MatSort,
    MatSortModule,
    MatSortHeader,
    MatDivider,
    DecimalPipe,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  dataSource: MatTableDataSource<HistoryData> = new MatTableDataSource<HistoryData>([]);
  displayedColumns: string[] = ['id', 'startTimestamp', 'duration', 'distance', 'nbRobots', 'simulation', 'identify'];

  constructor(public router: Router,
              public historyService: HistoryService) {
  }

  parseData(data: MissionStatus[]) {
    const historyData: HistoryData[] = [];
    for (const mission of data) {
      historyData.push({
        id: mission.missionId,
        startTimestamp: mission.startTimestamp,
        duration: mission.elapsedTime,
        nbRobots: mission.robotCount,
        distance: mission.distance,
        simulation: mission.isSimulation,
      });
    }
    this.dataSource = new MatTableDataSource(historyData);
    this.dataSource.sort = this.sort;
  }

  openMission(id: number) {
    this.router.navigate(['/mission', id]).then(() => {
    });
  }

  ngOnInit() {
    this.historyService.getMissions().subscribe((data: MissionStatus[]) => {
      this.parseData(data);
    });
  }

  ngAfterViewInit() {
    this.historyService.getMissions().subscribe((data: MissionStatus[]) => {
      this.parseData(data);
    });
  }
}
