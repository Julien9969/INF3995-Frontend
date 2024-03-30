import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environment";
import {BehaviorSubject, Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";

const LOCAL_URL = `${environment.serverUrl}api/ping/`;

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private _healthObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private readonly httpClient: HttpClient) {
    setInterval( () => {
      this.httpClient.get(LOCAL_URL, {responseType: 'text'}).subscribe((status) => {
        if(status){
          this._healthObservable.next(status.includes('pong'));
        }
      });
    }, 5000);
  }

  get check() {
    return this._healthObservable;
  }
}
