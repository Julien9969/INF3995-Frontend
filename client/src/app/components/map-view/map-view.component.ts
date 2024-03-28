import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MapService} from "@app/services/map/map.service";
import {NgIf} from "@angular/common";

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
  @ViewChild('mapCanvas', { static: false }) private mapCanvas!: ElementRef<HTMLCanvasElement>;
  mapInitialized: boolean = false;

  constructor(private mapService: MapService) {
  }

  get canvas(): HTMLCanvasElement {
    return this.mapCanvas.nativeElement;
  }

  get context(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  }

  ngAfterViewInit() {
    this.updateCanvas();
  }

  updateCanvas() {
    const defaultImage = this.mapService.image.getValue();
    this.context.drawImage(defaultImage, 0, 0, this.canvas.width, this.canvas.height)
    this.mapService.image.subscribe( (bitmap: HTMLImageElement) => {
      this.context.drawImage(bitmap, 0, 0, this.canvas.width, this.canvas.height)
    });
  }
}
