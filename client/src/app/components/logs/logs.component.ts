import {AfterViewInit, Component, ViewChild} from '@angular/core';
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
import {Logs} from "@app/classes/logs";
import {DatePipe, NgFor} from "@angular/common";

const LOGS: Logs[] = [
  {
    id: 1,
    robotId: 11,
    message: "{\"timestamp\": \"2024-02-03T14:25:37Z\",\"level\": \"ERROR\",\"message\": \"Failed to connect to the database.\",\"details\": {\"errorCode\": 500,\"errorType\": \"ConnectionError\",\"errorMessage\": \"Timeout occurred while trying to connect to the database on host 'db.example.com' using port '5432'.\",\"attemptedAction\": \"initializing application\",\"userId\": \"user123\",\"sessionId\": \"abc123xyz\",\"additionalInfo\": {\"retryAttempts\": 3,\"retryInterval\": \"5 seconds\",\"systemLoad\": \"moderate\",\"service\": \"UserService\"}}}"
    ,
    timestamp: 1000000
  },
  {
    id: 2,
    robotId: 9,
    message: "{\"timestamp\": \"2024-02-03T14:25:37Z\",\"level\": \"ERROR\",\"message\": \"Failed to connect to the database.\",\"details\": {\"errorCode\": 500,\"errorType\": \"ConnectionError\",\"errorMessage\": \"Timeout occurred while trying to connect to the database on host 'db.example.com' using port '5432'.\",\"attemptedAction\": \"initializing application\",\"userId\": \"user123\",\"sessionId\": \"abc123xyz\",\"additionalInfo\": {\"retryAttempts\": 3,\"retryInterval\": \"5 seconds\",\"systemLoad\": \"moderate\",\"service\": \"UserService\"}}}"
    ,
    timestamp: 1000000
  },
  {
    id: 3,
    robotId: 50,
    message: "{\"timestamp\": \"2024-02-03T14:25:37Z\",\"level\": \"ERROR\",\"message\": \"Failed to connect to the database.\",\"details\": {\"errorCode\": 500,\"errorType\": \"ConnectionError\",\"errorMessage\": \"Timeout occurred while trying to connect to the database on host 'db.example.com' using port '5432'.\",\"attemptedAction\": \"initializing application\",\"userId\": \"user123\",\"sessionId\": \"abc123xyz\",\"additionalInfo\": {\"retryAttempts\": 3,\"retryInterval\": \"5 seconds\",\"systemLoad\": \"moderate\",\"service\": \"UserService\"}}}"
    ,
    timestamp: 1000000
  },
]

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
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['id', 'robotId', 'message', 'timestamp']
  sortedData = new MatTableDataSource(LOGS)

  ngAfterViewInit() {
    if (this.sort) {
      this.sortedData.sort = this.sort;
    }
  }

}

