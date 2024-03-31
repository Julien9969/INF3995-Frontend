import {AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {BehaviorSubject} from "rxjs";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    NgIf,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {
  @Input() map!: BehaviorSubject<HTMLImageElement>;
  @ViewChild('mapCanvas', {static: false}) private mapCanvas!: ElementRef<HTMLCanvasElement>;
  private ratio: number = 16/9;
  height: number = 300;
  width: number = this.ratio * this.height;

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
  }

  zoomIn() {
    this.height += 50;
    this.width = this.ratio * this.height;
    this.context.drawImage(this.map.getValue(), 0, 0, this.width, this.height);
  }

  zoomOut() {
    this.height -= 50;
    this.width = this.ratio * this.height;
    this.context.drawImage(this.map.getValue(), 0, 0, this.width, this.height);
  }
}
