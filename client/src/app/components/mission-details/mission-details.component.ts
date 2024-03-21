import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MissionService} from '@app/services/mission/mission.service';

interface RobotData {
  id: number,
  distance: number;
  battery: number;
}

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
  robotDisplayedColumns: string[] = ['id', 'distance', 'battery'];
  robotDataSource: MatTableDataSource<RobotData> = new MatTableDataSource();
  elapsedTime: string = '0:00:00';
  missionStartedAt: number = 0;

  constructor(public readonly missionService: MissionService) {
    this.missionService.status.subscribe((updatedStatus) => {
      this.elapsedTime = this.formatTime(updatedStatus.elapsedTime)
      this.missionStartedAt = updatedStatus.startTimestamp * 1000
      this.robotDataSource.data = [];
      const newRobotLogs: RobotData[] = []
      for (let i = 0; i < updatedStatus.batteries.length; i++) {
        const newRobotData: RobotData = {
          id: i + 1,
          battery: Math.round(Math.random() * 100),
          distance: Math.round(Math.random() * 100),
        }
        newRobotLogs.push(newRobotData)
        this.robotDataSource.data = newRobotLogs
      }
    })
  }

  formatTime(timestamp: number): string {
    return new DatePipe('en-US').transform(timestamp * 1000, 'mm:ss') || '00:00'
  }
}
