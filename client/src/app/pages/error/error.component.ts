import {Component} from '@angular/core';
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";

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
  errorMessage: string = "";

  constructor(private route: Router) {
    const currentNavigation = this.route.getCurrentNavigation();
    if(currentNavigation) {
      this.errorMessage = currentNavigation.extras?.state?.['errorMessage'];
    }
  }
}
