import {AfterViewInit, Component, ViewChild} from '@angular/core';
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
import {HistoryData, HistoryService} from "@app/services/history/history.service";
import {DatePipe, NgIf} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSort, MatSortHeader, MatSortModule} from "@angular/material/sort";
import {MatDivider} from "@angular/material/divider";
import {initialData} from "@common/dummy-data";

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
export class HistoryComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: MatTableDataSource<HistoryData> = new MatTableDataSource<HistoryData>(initialData);
  displayedColumns: string[] = ['id', 'timestamp', 'duration', 'distance', 'robots', 'simulation', 'identify'];

  constructor(private healthCheck: HealthService,
              public router: Router,
              public historyService: HistoryService) {
    //this.dataSource.data = this.historyService.getMissions().getValue(); // Initialize with cached data
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
