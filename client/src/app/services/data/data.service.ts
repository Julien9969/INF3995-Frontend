import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "../../../environments/environment-ext";

const localUrl = (call: string) => `${environmentExt.apiUrl}mission/${call}`;

// À SUPPRIMER
/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  ping(): Observable<any> {
    // return this.http.get(localUrl("ping"));
    return this.http.get("http://localhost:8000/api/ping");
  }

  launchMission(data: any): Observable<any> {
    return this.http.post(localUrl("launch"), data);
  }

  getMission(id: any): Observable<any> {
    return this.http.get(localUrl(""), id);
  }

  deleteMission(id: any): Observable<any> {
    return this.http.delete(localUrl(""), id);
  }

  startMission(id: any): Observable<any> {
    return this.http.get(localUrl("start"), id);
  }

  stopMission(id: any): Observable<any> {
    return this.http.delete(localUrl("stop"), id);
  }
}
