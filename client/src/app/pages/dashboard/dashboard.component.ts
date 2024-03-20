import { NgForOf } from '@angular/common';
import {Component} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import { MatTable, MatTableModule } from '@angular/material/table';
import { MissionService } from '@app/services/mission/mission.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButton,
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  robots = [
    {id: 1, last_update: 17777777, battery: 0.25, distance: 0.11},
    {id: 2, last_update: 17777777, battery: 0.25, distance: 0.0},
  ];

  idResponses = ["",""]

  constructor(private readonly missionService: MissionService) {
  }

  identifyRobots(robotId: number) {
    this.missionService.identify(robotId).subscribe(response => this.idResponses[robotId - 1] = response);
  }
}
