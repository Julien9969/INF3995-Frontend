import {AfterViewInit, Component, Input, OnDestroy, ViewChild} from '@angular/core';
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
import {DatePipe, NgFor, NgIf} from "@angular/common";
import {MatChipsModule} from '@angular/material/chips'
import {BehaviorSubject, Subscription} from "rxjs"
import {Logs} from "@common";


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
    NgIf,
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['eventType', 'robotId', 'message', 'timestamp']
  dataSource: MatTableDataSource<Logs> = new MatTableDataSource()
  @Input() logs!: BehaviorSubject<Logs[]>;
  availableFilters: string[] = ['log', 'sensor', 'command'];
  activeFilters: Set<string> = new Set();
  private logSubscription: Subscription | undefined;

  constructor() {
  }

  subscribeToLogs() {
    this.logSubscription = this.logs.subscribe(newLogs => {
      const currentLogs = this.dataSource.data;
      this.dataSource = new MatTableDataSource([...currentLogs, ...newLogs]);
      this.dataSource.sort = this.sort;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.dataSource.filterPredicate = (data) => this.predicate(data);
    })
  }

  ngOnDestroy() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  predicate(data: any) {
    if (this.activeFilters.size === 0) {
      return true;
    }
    return this.activeFilters.has(data.eventType);
  }

  ngAfterViewInit() {
    this.subscribeToLogs();
  }

  removeFilter(filter: string) {
    this.activeFilters.delete(filter);
    this.applyFilters();
  }

  applyFilters() {
    this.dataSource.filter = '' + Math.random(); // triggers new filtering
  }

  toggleFilter(filter: string): void {
    if (this.activeFilters.has(filter)) {
      this.activeFilters.delete(filter);
    } else {
      this.activeFilters.add(filter);
    }
    this.applyFilters();
  }

}

