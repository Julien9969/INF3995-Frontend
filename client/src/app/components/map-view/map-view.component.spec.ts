import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapViewComponent} from './map-view.component';
import {MapService} from "@app/services/map/map.service";
import {BehaviorSubject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA} from "@angular/core";
import {RobotInformation} from "@common";

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;
  let mapServiceSpyObj: jasmine.SpyObj<MapService>;
  let robots: BehaviorSubject<RobotInformation[]>;
  let map: BehaviorSubject<HTMLImageElement>;
  let elementRefSpyObj: jasmine.SpyObj<ElementRef>;

  beforeEach(async () => {
    robots = new BehaviorSubject<RobotInformation[]>([]);
    map = new BehaviorSubject<HTMLImageElement>(new Image());

    mapServiceSpyObj = jasmine.createSpyObj('MapService', ['getMap'], { image: new Image()});
    elementRefSpyObj = jasmine.createSpyObj(
      'ElementRef',
      {},
      {
        nativeElement: {
          getContext: () => {
            return {
              fillStyle: '',
              arc: () => {},
              drawImage: () => {
              },
              beginPath: () => {
              },
              fill: () => {
              },
              stroke: () => {
              },
            };
          },
        },
      },
    );
    await TestBed.configureTestingModule({
      imports: [MapViewComponent],
      providers: [
        { provide: MapService, useValue: mapServiceSpyObj },
        { provide: ElementRef, useValue: elementRefSpyObj},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    component.map = map;
    component.robots = robots;
    fixture.detectChanges();
  });

  it('should create', () => {
    map.next(new Image());
    robots.next([{
      id: 1,
      name: "Robot 1",
      battery: 100,
      state: "Idle",
      lastUpdate: 0,
      distance: 0,
      initialPosition: {
        x: 0,
        y: 0
      },
      position: {
        x: 0,
        y: 0
      }
    }]);
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    const isActualPosition = component["drawActualPosition"];
    const isInitialPosition = component["drawInitialPosition"];
    expect(component.toggleActualPosition()).toEqual(!isActualPosition);
    expect(component.toggleInitialPosition()).toEqual(!isInitialPosition);
  });

  it('should draw', () => {
    component.drawPositionIndicator(0, 0, 'green');
    expect(elementRefSpyObj.nativeElement.context.getContext).toHaveBeenCalled();
  });
});
