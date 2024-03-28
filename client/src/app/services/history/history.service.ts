import { Injectable } from '@angular/core';
import {HealthService} from "@app/services/health/health.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private healthCheck: HealthService,
              public router: Router,
              private httpClient: HttpClient) {
    this.healthCheck.check.subscribe((connected) => {
      if(connected) {
        this.queryHistory()
      }
    });
  }

  queryHistory(): void {
    this.httpClient.get(localUrl(""), {responseType: 'text'}).subscribe((data) => {
      console.log(data);
    });
  }
}
