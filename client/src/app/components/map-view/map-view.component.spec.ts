import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapViewComponent} from './map-view.component';
import {MapService} from "@app/services/map/map.service";
import {BehaviorSubject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA} from "@angular/core";

describe('MapViewComponent', () => {
  let component: MapViewComponent;
  let fixture: ComponentFixture<MapViewComponent>;
  let mapServiceSpyObj: jasmine.SpyObj<MapService>;

  beforeEach(async () => {
    mapServiceSpyObj = jasmine.createSpyObj('MapService', ['getMap'], { image: new Image()});
    const elementRef = jasmine.createSpyObj(
      'ElementRef',
      {},
      {
        nativeElement: {
          offsetParent: {},
        },
      },
    );
    await TestBed.configureTestingModule({
      imports: [MapViewComponent],
      providers: [
        { provide: MapService, useValue: mapServiceSpyObj },
        { provide: ElementRef, useValue: elementRef}
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MapViewComponent);
    component = fixture.componentInstance;
    component.map = new BehaviorSubject<HTMLImageElement>(new Image());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    const isActualPosition = component["drawActualPosition"];
    const isInitialPosition = component["drawInitialPosition"];
    expect(component.toggleActualPosition).toEqual(!isActualPosition);
    expect(component.toggleInitialPosition).toEqual(!isInitialPosition);
  });
});
