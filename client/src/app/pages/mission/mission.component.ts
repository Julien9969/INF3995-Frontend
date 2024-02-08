import { Component } from '@angular/core';
import {MissionControlsComponent} from "../../components/mission-controls/mission-controls.component";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-mission',
standalone: true,
imports: [MissionControlsComponent, MatCard],
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent {

}
