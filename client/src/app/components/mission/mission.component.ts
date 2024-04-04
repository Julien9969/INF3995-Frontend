import {AfterViewInit, Component, Input} from '@angular/core';
import {MatCard, MatCardContent, MatCardModule} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatAccordion, MatExpansionModule, MatExpansionPanel} from "@angular/material/expansion";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MapViewComponent} from "@app/components/map-view/map-view.component";
import {MissionState, MissionStatus} from '@common';
import {MatTooltip} from "@angular/material/tooltip";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {formatCounter} from "@app/helpers/utils";
import {BehaviorSubject} from "rxjs";
import {MatDialogTitle} from "@angular/material/dialog";

interface MissionInfo {
  missionId: number;
  elapsedTime: string;
  timestamp: number;
}

@Component({
  imports: [MatCardModule,
    MatCard,
    MatDivider,
    MatButton,
    MatIcon,
    MatIconButton,
    LogsComponent,
    MatGridList,
    MatGridTile,
    MatCardContent,
    MatToolbar,
    MatMenuModule,
    MatMenuTrigger,
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanel,
    MapViewComponent,
    NgForOf,
    MatPaginator,
    NgIf,
    MatTooltip,
    MatProgressSpinner,
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatRow,
    MatRowDef,
    MatTable, MatDialogTitle,
  ],
  selector: 'app-mission',
  standalone: true,
  styleUrl: './mission.component.scss',
  templateUrl: './mission.component.html'
})
export class MissionComponent implements AfterViewInit {
  @Input() missionState: MissionState = MissionState.NOT_STARTED;
  @Input() status: BehaviorSubject<MissionStatus> = new BehaviorSubject<MissionStatus>({} as MissionStatus);
  protected readonly MissionState = MissionState;
  displayedColumns: string[] = ["missionId", "elapsedTime", "timestamp"];
  rowData: MissionInfo = {} as MissionInfo;
  infoDataSource = new MatTableDataSource([this.rowData])

  ngAfterViewInit() {
    this.status.subscribe((updatedStatus) => {
      if(updatedStatus) {
        this.rowData = {
          missionId: updatedStatus.missionId,
          elapsedTime: formatCounter(updatedStatus.elapsedTime),
          timestamp: updatedStatus.startTimestamp * 1000,
        }
        this.infoDataSource.data = [this.rowData]
      }
    });
  }
}
