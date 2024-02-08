import { Component, OnInit } from '@angular/core';
import {MatDialogClose} from "@angular/material/dialog";
import {MatCellDef, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule} from "@angular/material/table";
import {MatIcon} from "@angular/material/icon";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-logs',
standalone: true,
  imports: [
    MatDialogClose,
    MatTableModule,
    MatIcon,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatCard
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'age'];
  data = [
    {id: 1, name: 'John Doe', age: 30},
    {id: 2, name: 'Jane Smith', age: 25},
    {id: 3, name: 'Jane Smith', age: 35},
    {id: 4, name: 'Jane Smith', age: 15},
  ]

  constructor() { }

  ngOnInit(): void {
    console.log("LogsComponent.ngOnInit()");
  }
}
