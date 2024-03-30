import {Injectable} from '@angular/core';
import {SocketService} from "@app/services/socket/socket.service";
import {BehaviorSubject} from "rxjs";
import {WebsocketsEvents} from "@app/classes/websockets-events";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly imageSubject: BehaviorSubject<HTMLImageElement>;
  private defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAANpJREFUSEvtVdEOwjAIZF+mfpnuy9Qvc7tlZ64IY0tcjFFemrTAcbQ9OtvZup3z20cAjmZ2npndx/XiWPIcK6wPfJ4hngGSMTmdTmZ2E5BH0lbvN7l5gOuYDJWhKhjAkBzBMBaAPfVBjPqlDCIALYTVa7VIjrio4BcGUYu0xwTwzLP98BUpiL/AtwCA6tZEmxj8AZpvkknFb93B0rNO1XRti6qPWQJUksBCMu1KAahJkajp767EMQVQAfPqrC8v8mvkpZpo2mOy0dlACT/I8GnOK4Bktqzf/n6AAZWSSxlIWkc6AAAAAElFTkSuQmCC"
  constructor(private readonly socket: SocketService) {
    const image = new Image();
    image.src = this.defaultImage;
    this.imageSubject = new BehaviorSubject<HTMLImageElement>(image)
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
  }

  // TODO: Display realtime location of the robots by drawing dots on the canvas
}
