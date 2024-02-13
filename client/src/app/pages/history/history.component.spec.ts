import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HistoryComponent} from './history.component';
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import { MatTableModule} from "@angular/material/table";

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HistoryComponent,
        BrowserModule,
        HttpClientModule,
        MatTableModule,
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
