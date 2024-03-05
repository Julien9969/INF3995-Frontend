import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";
import {
  MatCellDef,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTableDataSource,
  MatTableModule
} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {DatePipe, NgFor} from "@angular/common";
import { LogsService } from '@app/services/logs/logs.service';
import { MatChipsModule } from '@angular/material/chips'
import { Subscription } from "rxjs"


@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    MatDialogClose,
    MatTableModule,
    MatIcon,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatCard,
    MatSortHeader,
    MatSort,
    MatTableModule,
    DatePipe,
    NgFor,
    MatChipsModule,
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['logId', 'robotId', 'message', 'timestamp']
  dataSource = new MatTableDataSource()
  private logSubscription: Subscription | undefined;
  constructor(private readonly logsService: LogsService) {}

  subscribeToLogs() {
    this.logSubscription = this.logsService.logs.subscribe(newLogs => {
      const currentLogs = this.dataSource.data;
      console.log("Current logs number", currentLogs.length)
      this.dataSource.data = [...currentLogs, ...newLogs];
      console.log("New logs number", this.dataSource.data.length)
    })
  }

  ngOnDestroy() {
      if(this.logSubscription) {
        this.logSubscription.unsubscribe()
      }
    }

  ngOnInit() {
    this.subscribeToLogs()
    this.logsService.add()
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

}

