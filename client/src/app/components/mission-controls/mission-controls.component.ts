import { Component } from '@angular/core';
import {MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-mission-controls',
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatButton,
    MatIconButton,
    MatIcon,
    MatFabButton,
    MatCard
  ],
  templateUrl: './mission-controls.component.html',
  styleUrl: './mission-controls.component.scss'
})
export class MissionControlsComponent {
  createDisabled = false;
  launchDisabled = true;
  stopDisabled = true;

  onCreate() {
    this.createDisabled = true;
    this.launchDisabled = false;
  }

  onLaunch() {
    this.launchDisabled = true;
    this.stopDisabled = false;
  }

  onStop() {
    this.stopDisabled = true;
    this.launchDisabled = false;
  }
}
