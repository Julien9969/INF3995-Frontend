import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  constructor(private http: HttpClient) {
  }

  identify(robotId: number): Observable<string> {
    return this.http.get(localUrl(`identify/id/${robotId}`), { responseType: 'text' })
      .pipe(
        map(response => response.toString())
      );
  }

  checkConnection(): Observable<number[]> {
    return this.http.get(localUrl(`identify/connected`), { responseType: 'text' })
      .pipe(
        map(response => {console.log(response); return response as unknown as number[];} )
      );
  }

  startMission(): Observable<string> {
    return this.http.post(localUrl(`mission/start`), { responseType: 'text' })
      .pipe(
        map(response => response.toString())
      );
  }

  stopMission(): Observable<string> {
    return this.http.post(localUrl(`mission/stop`), { responseType: 'text' })
      .pipe(
        map(response => response.toString())
      );
  }
}
