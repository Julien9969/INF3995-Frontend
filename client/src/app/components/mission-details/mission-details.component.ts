import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MissionData} from "@app/classes/mission-data";
import {RobotData} from "@app/classes/robots";

@Component({
  selector: 'app-mission-details',
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
  templateUrl: './mission-details.component.html',
  styleUrl: './mission-details.component.scss'
})
export class MissionDetailsComponent {
  robot: RobotData = {
    distance: '120km',
    status: 'Active',
    battery: 85,
    lastUpdate: '2023-01-31 15:00:00'
  };
  missionData: MissionData = {
    name: 'Example Mission',
    distance: '150km',
    elapsedTime: '0:46:21',
    status: 'Completed'
  };
  missionDisplayedColumns: string[] = ['name', 'distance', 'elapsedTime', 'status'];
  missionDataSource: MatTableDataSource<MissionData> = new MatTableDataSource([this.missionData]);
  robotDisplayedColumns: string[] = ['distance', 'status', 'battery', 'lastUpdate'];
  robotDataSource: MatTableDataSource<RobotData> = new MatTableDataSource([this.robot]);

  robots = [
    {id: 1337, last_update: 17777777, battery: 0.25, distance: 0.11},
    {id: 1338, last_update: 17777777, battery: 0.25, distance: 0.0},
    {id: 1339, last_update: 17777777, battery: 0.25, distance: 0.45},
  ];

  identify() {

  }
}
