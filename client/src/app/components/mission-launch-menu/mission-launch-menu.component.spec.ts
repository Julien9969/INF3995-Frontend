import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionLaunchMenuComponent } from './mission-launch-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MissionLaunchMenuComponent', () => {
  let component: MissionLaunchMenuComponent;
  let fixture: ComponentFixture<MissionLaunchMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [MissionLaunchMenuComponent, MatInputModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, BrowserAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissionLaunchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
