import {Component} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [
    MatIconButton,
    MatButton,
    MatIcon
  ],
  templateUrl: './ide.component.html',
  styleUrl: './ide.component.scss'
})
export class IdeComponent {
  redirect() {
    // Check IDE Connection
    window.location.href = "http://localhost:3000"
  }
}
