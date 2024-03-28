import {DatePipe} from "@angular/common";

function formatCounter(timestamp: number): string {
  return new DatePipe('en-US').transform(timestamp * 1000, 'mm:ss') || '00:00'
}

export { formatCounter };
