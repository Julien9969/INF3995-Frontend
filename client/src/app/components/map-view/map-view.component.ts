import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {RobotInformation} from "@common";

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    NgIf,
    MatIconButton,
    MatIcon,
    MatSlideToggle,
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {
  @Input() map!: BehaviorSubject<HTMLImageElement>;
  @Input() robots!: BehaviorSubject<RobotInformation[]>;
  height: number = 300;
  @ViewChild('mapCanvas', {static: false}) private mapCanvas!: ElementRef<HTMLCanvasElement>;
  private ratio: number = 16 / 9;
  width: number = this.ratio * this.height;
  private drawActualPosition: boolean = true;
  private drawInitialPosition: boolean = true;

  constructor() {
  }

  get mapInitialized(): boolean {
    return this.map.getValue() !== undefined;
  }

  get canvas(): HTMLCanvasElement {
    return this.mapCanvas.nativeElement;
  }

  get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d', {willReadFrequently: true}) as CanvasRenderingContext2D;
  }

  ngAfterViewInit() {
    this.map.subscribe((bitmap: HTMLImageElement) => {
      this.context.drawImage(bitmap, 0, 0, this.width, this.height);
    });

    this.robots.subscribe((robots: RobotInformation[]) => {
      robots.forEach((robot: RobotInformation) => {
        if (this.drawActualPosition) {
          this.drawPositionIndicator(robot.position.x, robot.position.y, 'green')
        }
        if (this.drawInitialPosition) {
          this.drawPositionIndicator(robot.initialPosition.x, robot.initialPosition.y, 'blue')
        }
      });
    });
  }

  drawPositionIndicator(x: number, y: number, color: string) {
    this.context.beginPath();
    this.context.arc(x, y, 10, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();
  }

  toggleActualPosition() {
    this.drawActualPosition = !this.drawActualPosition;
  }

  toggleInitialPosition() {
    this.drawActualPosition = !this.drawActualPosition;
  }
}
