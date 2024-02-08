import { Component } from '@angular/core';
import {MatStep, MatStepperModule} from "@angular/material/stepper";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-mission-launch-menu',
  standalone: true,
  imports: [
    MatStep,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './mission-launch-menu.component.html',
  styleUrl: './mission-launch-menu.component.css'
})
export class MissionLaunchMenuComponent {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;

  constructor(private _formBuilder: FormBuilder) {}
}
