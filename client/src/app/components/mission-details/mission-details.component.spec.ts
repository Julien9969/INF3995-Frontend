import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MissionDetailsComponent} from './mission-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MissionDetailsComponent', () => {
  let component: MissionDetailsComponent;
  let fixture: ComponentFixture<MissionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MissionDetailsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MissionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
