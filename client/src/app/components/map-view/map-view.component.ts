import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {
  @Input() map!: BehaviorSubject<HTMLImageElement>;
  mapInitialized: boolean = false;
  @ViewChild('mapCanvas', {static: false}) private mapCanvas!: ElementRef<HTMLCanvasElement>;

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
      this.context.drawImage(bitmap, 0, 0, this.canvas.width, this.canvas.height);
      this.mapInitialized = true;
    });
  }
}
