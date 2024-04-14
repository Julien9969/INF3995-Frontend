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
  private ratio: number = 1 / 1;
  width: number = this.ratio * this.height;
  private drawActualPosition: boolean = true;
  private drawInitialPosition: boolean = false;
  private last_bitmap?: HTMLImageElement;
  private robot_positions: {x: number, y: number}[] = [];
  private resizeRatios : {x: number, y: number} = {x: 1, y: 1};

  constructor() {
  }

  get canvas(): HTMLCanvasElement {
    return this.mapCanvas.nativeElement;
  }

  get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d', {willReadFrequently: true}) as CanvasRenderingContext2D;
  }

  ngAfterViewInit() {
    this.map.subscribe((bitmap: HTMLImageElement) => {
      this.last_bitmap = bitmap;
      this.context.drawImage(bitmap, 0, 0, this.width, this.height);
      this.resizeRatios.x = this.width / bitmap.width;
      this.resizeRatios.y = this.height / bitmap.height;
      this.robot_positions.forEach((pos: {x: number, y: number}, index) => {
        if(this.drawActualPosition && pos) {
          this.drawPositionIndicator(pos.x, pos.y, 'green', index)
        }
      })
    });

    this.robots.subscribe((robots: RobotInformation[]) => {
      if(this.last_bitmap) this.context.drawImage(this.last_bitmap, 0, 0, this.width, this.height);
      robots.forEach((robot: RobotInformation, index) => {
        console.log(robot); // to simply avoid linting error
        if (this.drawActualPosition) {
          this.drawPositionIndicator(robot.position.x, robot.position.y, 'green', index)
        }
        if (this.drawInitialPosition) {
          this.drawPositionIndicator(robot.initialPosition.x, robot.initialPosition.y, 'blue', index)
        }
      });
    });
  }

  drawPositionIndicator(x: number, y: number, color: string, robot_idx: number) {
    this.robot_positions[robot_idx] = { x, y }
    this.context.beginPath();
    this.context.arc(x * this.resizeRatios.x, y * this.resizeRatios.y, 10, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();
    this.context.fillStyle = 'white';
    this.context.font = "bold 18px sans-serif";
    this.context.fillText((robot_idx+1).toString(), x * this.resizeRatios.x - 5, y * this.resizeRatios.y + 5)
    // Draw image as well
  }

  toggleActualPosition() {
    this.drawActualPosition = !this.drawActualPosition;
    return this.drawActualPosition;
  }

  toggleInitialPosition() {
    this.drawInitialPosition = !this.drawInitialPosition;
    return this.drawInitialPosition;
  }
}
