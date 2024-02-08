import { Component } from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-ide',
standalone: true,
imports: [
MatIconButton,
MatButton
],
  templateUrl: './ide.component.html',
  styleUrl: './ide.component.scss'
})
export class IdeComponent {

}
