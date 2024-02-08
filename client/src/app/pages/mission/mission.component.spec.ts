import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MissionComponent } from './mission.component';
import { MatCard } from '@angular/material/card';
import { Component } from '@angular/core';


@Component({
    selector: 'app-mission-controls',
    template: '<div></div>',
    standalone: true,
})
export class StubMissionControlsComponent {

}


describe('MissionsComponent', () => {
  let component: MissionComponent;
  let fixture: ComponentFixture<MissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [MissionComponent, StubMissionControlsComponent, MatCard],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
