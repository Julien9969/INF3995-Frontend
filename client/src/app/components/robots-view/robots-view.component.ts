import {Component, Input, OnChanges} from '@angular/core';
import {MatCard, MatCardContent, MatCardModule} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {LogsComponent} from "@app/components/logs/logs.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatAccordion, MatExpansionModule, MatExpansionPanel} from "@angular/material/expansion";
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MapViewComponent} from "@app/components/map-view/map-view.component";
import {MissionState, RobotInformation} from '@common';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTooltip} from "@angular/material/tooltip";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {BehaviorSubject} from "rxjs";
import {MatDialogTitle} from "@angular/material/dialog";
import {RobotsService} from "@app/services/robots/robots.service";


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
    MatTable, MatDialogTitle, DecimalPipe,
  ],
  selector: 'app-robots-view',
  standalone: true,
  styleUrl: './robots-view.component.scss',
  templateUrl: './robots-view.component.html'
})
export class RobotsViewComponent implements OnChanges {
  @Input() robots!: BehaviorSubject<RobotInformation[]>;
  @Input() missionState!: MissionState;
  @Input() isTimemachine!: boolean;
  robotDisplayedColumns: string[] = ['id', 'state', 'distance', 'battery', 'identify'];
  robotDataSource = new MatTableDataSource();

  constructor(private matSnackBar: MatSnackBar,
              private robotsService: RobotsService) {
  }


  ngOnChanges() {
    this.robots.subscribe((updatedRobots: RobotInformation[]) => {
      this.robotDataSource.data = updatedRobots
    });
  }

  openSnackBar(message: string) {
    this.matSnackBar.open(message, 'Fermer', {
      duration: 4000,
    });
  }

  identifyRobots(robotId: number) {
    if (this.missionState !== MissionState.ONGOING) {
      this.openSnackBar(`Requête d'identification envoyée au robot ${robotId}!`)
    } else {
      this.openSnackBar("Impossible d'identifier les robots pendant une mission en cours!")
    }
    this.robotsService.identify(robotId).subscribe(() => this.openSnackBar(`Robot ${robotId} s'est identifié!`));
  }

  toggleHeadBack() {
    this.openSnackBar(`Requête de retour à la base envoyée aux robots!`);
    this.robotsService.headBackBase().subscribe((result) => this.openSnackBar(result.message));
  }

  protected readonly MissionState = MissionState;
}
