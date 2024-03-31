import {Injectable} from '@angular/core';
import {SocketService} from "@app/services/socket/socket.service";
import {BehaviorSubject} from "rxjs";
import {WebsocketsEvents} from "@common";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly imageSubject: BehaviorSubject<HTMLImageElement>;
  isDefaultMap: boolean = true;
  constructor(private readonly socket: SocketService) {
    const image = new Image();
    image.src = "";
    this.imageSubject = new BehaviorSubject<HTMLImageElement>(image);
    this.socket.on(WebsocketsEvents.MAP_DATA, (bitmapBase64: string) => this.loadImage(bitmapBase64))
  }

  get image() {
    return this.imageSubject;
  }

  loadImage(bitmapBase64: string) {
    // Check if image is in correct base64 format
    if (!bitmapBase64.startsWith('data:image/bmp;base64,')) {
      return;
    }
    // Create image
    const image = new Image();
    image.onload = async () => {
      this.imageSubject.next(image); // sends the loaded image to the subscribers
    }
    image.src = bitmapBase64;
    this.isDefaultMap = false;
  }
}
