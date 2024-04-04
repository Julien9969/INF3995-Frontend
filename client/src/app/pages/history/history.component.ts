import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatCard} from "@angular/material/card";
import {
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {HealthService} from "@app/services/health/health.service";
import {Router} from "@angular/router";
import {HistoryService} from "@app/services/history/history.service";
import {DatePipe, NgIf} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {MatDivider} from "@angular/material/divider";
import {initialData} from "@common/dummy-data";
import {MissionStatus} from "@common";


export interface HistoryData {
  id: number,
  startTimestamp: number,
  duration: number,
  nbRobots: number,
  distance: number,
  isSimulation: boolean,
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
    MatPaginatorModule,
    MatDivider,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<HistoryData> = new MatTableDataSource<HistoryData>(initialData);
  displayedColumns: string[] = ['id', 'timestamp', 'duration', 'distance', 'robots', 'simulation', 'identify'];

  constructor(public router: Router,
              public historyService: HistoryService) {
  }

  ngOnInit() {
    if(this.historyService.getMissions().getValue().length !== 0) {
      this.parseData(this.historyService.getMissions().getValue());
    }
    this.historyService.getMissions().subscribe((data: MissionStatus[]) => {
      this.parseData(data);
    });
  }

  parseData(data: MissionStatus[]) {
    const historyData: HistoryData[] = [];
    for (const mission of this.historyService.getMissions().getValue()) {
      historyData.push({
        id: mission.missionId,
        startTimestamp: mission.startTimestamp,
        duration: mission.elapsedTime,
        nbRobots: mission.robotCount,
        distance: 0,
        isSimulation: false,
      });
    }
    this.dataSource.data = historyData;
  }

  openMission(id: number) {
    this.router.navigate(['/mission', id]).then(() => {});
  }

  formatTime(timestamp: number): string {
    return new DatePipe('en-US').transform(timestamp * 1000, 'mm:ss') || '00:00'
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
}
