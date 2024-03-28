import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environment";
import {Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";

const LOCAL_URL = `${environment.serverUrl}api/ping/`;

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private _healthObservable: Subject<boolean> = new Subject<boolean>();
  constructor(private readonly httpClient: HttpClient) {
    setInterval(async () => {
      this.isServerOk()
    }, 2000);
  }

  isServerOk() {
    this.httpClient.get(LOCAL_URL, {responseType: 'text'}).subscribe((status) => {
      this._healthObservable.next(status === 'pong');
    });
  }

  get check(): Observable<boolean> {
    return this._healthObservable.asObservable();
  }
}
