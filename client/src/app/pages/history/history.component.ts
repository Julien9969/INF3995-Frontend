import {Component} from '@angular/core';
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatCard} from "@angular/material/card";
import {
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {HealthService} from "@app/services/health/health.service";
import {Router} from "@angular/router";
import {HistoryData, HistoryService} from "@app/services/history/history.service";
import {DatePipe, NgIf} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";

const initialData: HistoryData[] = [
  {id: 1, startTimestamp: 1620000000, duration: 3600, nbRobots: 1},
  {id: 2, startTimestamp: 1620000000, duration: 3600, nbRobots: 2},
  {id: 3, startTimestamp: 1620000000, duration: 3600, nbRobots: 3},
  {id: 4, startTimestamp: 1620000000, duration: 3600, nbRobots: 4},
  {id: 5, startTimestamp: 1620000000, duration: 3600, nbRobots: 5},
];

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
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  dataSource: MatTableDataSource<HistoryData> = new MatTableDataSource<HistoryData>(initialData);
  displayedColumns: string[] = ['id', 'timestamp', 'duration', 'robots', 'identify'];

  constructor(private healthCheck: HealthService,
              public router: Router,
              public historyService: HistoryService) {
    this.dataSource.data = this.historyService.getMissions().getValue(); // Initialize with cached data
  }

  openMission(id: number) {
    this.router.navigate(['/mission', id]).then(() => {});
  }

  formatTime(timestamp: number): string {
    return new DatePipe('en-US').transform(timestamp * 1000, 'mm:ss') || '00:00'
  }
}
