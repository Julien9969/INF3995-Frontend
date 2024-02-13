import {Component} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    MatIconModule,
    MatIcon,
    NgIf
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {

}
