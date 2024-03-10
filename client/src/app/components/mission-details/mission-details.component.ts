import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DatePipe, NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTable, MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MissionService} from '@app/services/mission/mission.service';

interface MissionData {
  name: string;
  elapsedTime: number;
}

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
  missionDisplayedColumns: string[] = ['name', 'elapsedTime'];
  missionDataSource: MatTableDataSource<MissionData> = new MatTableDataSource();
  robotDisplayedColumns: string[] = ['id', 'distance', 'battery'];
  robotDataSource: MatTableDataSource<RobotData> = new MatTableDataSource();

  constructor(public readonly missionService: MissionService) {
    this.missionService.status.subscribe((updatedStatus) => {
      const newMissionData: MissionData = {
        name: "Mission", // TODO: read actual value
        elapsedTime: updatedStatus.elapsedTime
      }
      this.missionDataSource.data = [newMissionData]

      this.robotDataSource.data = []
      for (let i = 0; i < updatedStatus.count; i++) {
        const newRobotData: RobotData = {
          id: i,
          battery: updatedStatus.batteries[i],
          distance: updatedStatus.distances[i],
        }
      }
    })
  }
}
