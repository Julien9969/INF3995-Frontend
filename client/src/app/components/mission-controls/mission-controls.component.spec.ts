import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionControlsComponent } from './mission-controls.component';
import { MatIcon } from '@angular/material/icon';

describe('MissionControlsComponent', () => {
  let component: MissionControlsComponent;
  let fixture: ComponentFixture<MissionControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [MissionControlsComponent, MatIcon]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissionControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
