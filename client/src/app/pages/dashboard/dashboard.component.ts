import { Component, OnInit } from '@angular/core';
import {DataService} from "@app/services/data/data.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  data: unknown;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.ping()
      .subscribe({ complete: console.log, error: console.error, next: console.log});
  }
}
