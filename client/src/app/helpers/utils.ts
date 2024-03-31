import {DatePipe} from "@angular/common";
import {environmentExt} from "@environment-ext";

function formatCounter(timestamp: number): string {
  return new DatePipe('en-US').transform(timestamp * 1000, 'mm:ss') || '00:00'
}

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;


export { formatCounter, localUrl };
