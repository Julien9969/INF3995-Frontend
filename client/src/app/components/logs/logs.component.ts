/* eslint-disable @typescript-eslint/no-explicit-any */
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class LogsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['eventType', 'robotId', 'message', 'timestamp']
  dataSource = new MatTableDataSource()
  @Input() logs!: BehaviorSubject<Logs[]>;
  availableFilters: string[] = ['log', 'senseurs', 'commandes'];
  activeFilters: Set<string> = new Set();
  private logSubscription: Subscription | undefined;

  constructor() {
  }

  subscribeToLogs() {
    this.logSubscription = this.logs.subscribe(newLogs => {
      const currentLogs = this.dataSource.data;
      this.dataSource.data = [...currentLogs, ...newLogs];
    })
  }

  ngOnDestroy() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe()
    }
  }

  ngOnInit() {
    this.subscribeToLogs();
    this.dataSource.filterPredicate = (data: any) => this.predicate(data);
  }

  predicate(data: any) {
    if (this.activeFilters.size === 0) {
      return true;
    }
    return this.activeFilters.has(data.eventType);
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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

