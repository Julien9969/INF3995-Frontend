import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {QuitPopupComponent} from "@app/components/quit-popup/quit-popup.component";

@Injectable({
  providedIn: 'root'
})
export class QuitPopupService {
  constructor(private dialog: MatDialog) {}

  openPopup() {
    this.dialog.open(QuitPopupComponent);
  }
}
