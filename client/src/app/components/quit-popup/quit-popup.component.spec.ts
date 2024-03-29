import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuitPopupComponent } from './quit-popup.component';

describe('QuitPopupComponent', () => {
  let component: QuitPopupComponent;
  let fixture: ComponentFixture<QuitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuitPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
