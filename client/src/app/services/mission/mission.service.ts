import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";

const localUrl = (call: string) => `${environmentExt.apiUrl}mission/${call}`;

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  constructor(private http: HttpClient) {
  }

  ping(): Observable<string> {
    return this.http.get(localUrl("identify"), { responseType: 'text' })
      .pipe(
        map(response => response.toString())
      );
  }
}
