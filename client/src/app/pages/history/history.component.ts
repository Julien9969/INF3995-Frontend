import {Component} from '@angular/core';
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatPaginator} from "@angular/material/paginator";
import {MatCard} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    LogsComponent,
    MatPaginator,
    MatCard,
    MatTableModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  displayedColumns: string[] = ['id', 'name', 'age'];
  data = [
    {id: 1, name: 'John Doe', age: 30},
    {id: 2, name: 'Jane Smith', age: 25},
    {id: 3, name: 'Jane Smith', age: 35},
    {id: 4, name: 'Jane Smith', age: 15},
  ]
}
