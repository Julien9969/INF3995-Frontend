/* eslint-disable @typescript-eslint/no-explicit-any */
import {NestedTreeControl} from '@angular/cdk/tree';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTreeModule, MatTreeNestedDataSource} from "@angular/material/tree";
import {CommonModule} from '@angular/common';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {FormsModule} from '@angular/forms';
import {FilesService} from '@app/services/files/files.service';
import {FilesTree, FilesTreeNode} from '@app/classes/files-tree';
import {File} from '@app/classes/file';
import {HttpResponse} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatToolbar} from "@angular/material/toolbar";
import {HealthService} from "@app/services/health/health.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ConfirmationDialogComponent} from "@app/components/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatCard, MatCardContent, MatCardHeader, MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-ide',
  standalone: true,
  imports: [
    MatIconButton,
    MatButton,
    MatIcon,
    MatTreeModule,
    CommonModule,
    FormsModule,
    CodemirrorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbar,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule
  ],
  templateUrl: './ide.component.html',
  styleUrl: './ide.component.scss'
})
export class IdeComponent implements OnInit, OnDestroy {
  wasRobotChose: boolean = false;
  health: Subscription = new Subscription();
  treeControl = new NestedTreeControl<FilesTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FilesTreeNode>();
  filesTree: FilesTree = [];
  codeEditorContent: string = "";
  currentFile: FilesTreeNode | null = null;
  selectedRobotId: number | null = null;
  codeMirrorOptions: any = {
    mode: {
      name: "python",
      version: 3,
      singleLineStringErrors: false
    },
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    extraKeys: {"Ctrl-Space": "autocomplete"},
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
  };
  isDirty: boolean = false;


  constructor(private filesService: FilesService,
              private _snackBar: MatSnackBar,
              private healthService: HealthService,
              public router: Router,
              public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    /*if (this.healthService.check.getValue()) {
      this.router.navigate(['/error']).then(() => {
      });
    }*/
    return;
  }

  ngOnDestroy() {
    this.health.unsubscribe();
  }

  onRobotSelected() {
    this.wasRobotChose = true;
    try {
      if (this.selectedRobotId === null) {
        return;
      }
      this.filesService.getFileTree(this.selectedRobotId).subscribe({
        next: (response: HttpResponse<string>) => {
          console.log("Response code:", response.status);
          this.filesTree = JSON.parse(response.body as string) as FilesTree;
          this.dataSource.data = this.filesTree;

          this.openSnackBar(`Arbre de fichier du robot ${this.selectedRobotId} récupéré`);
        },
        error: (error) => {
          console.error("Error:", error);
          this.openSnackBar(`Erreur lors de la récupération de l'arbre de fichier du robot ${this.selectedRobotId}`, true);
        }
      });
    } catch (error) {
      console.error(error);
      this.openSnackBar(`Erreur lors de la récupération de l'arbre de fichier du robot ${this.selectedRobotId}`, true);
    }
  }


  saveFile() {
    console.log(this.codeEditorContent);
    if (this.selectedRobotId === null || this.currentFile == null) {
      this.openSnackBar(`Pas de robot ou de fichier sélectionné`, true);
      return;
    }
    this.filesService.saveFile(this.selectedRobotId, this.currentFile, this.codeEditorContent).subscribe({
      next: (response: HttpResponse<string>) => {
        console.log("Response code:", response.status);
        console.log("Response body:", response.body);
        this.openSnackBar(`Fichier sauvegardé`);
        this.isDirty = false;
      },
      error: (error) => {
        console.error("Error:", error);
        this.openSnackBar(`Erreur lors de la sauvegarde du fichier`, true);
      }
    });
    console.log("save");
  }

  loadFile(file: FilesTreeNode) {
    console.log("Loading file:", file);
    this.currentFile = file;
    if (this.selectedRobotId === null) return;
    this.filesService.getFile(this.selectedRobotId, file).subscribe({
      next: (response: HttpResponse<object>) => {
        console.log("Response:", response);
        console.log((response.body as File).content);
        this.codeEditorContent = (response.body as File).content;
        this.openSnackBar(`Fichier ${file.name} chargé`);
      },
      error: (error) => {
        console.error("Error:", error);
        this.openSnackBar(`Erreur lors du chargement du fichier ${file.name}`, true);
      }
    });
    this.isDirty = true;
  }

  updateRobot() {
    console.log("Updating robot:", this.selectedRobotId);
    if (this.selectedRobotId === null || this.currentFile == null) {
      this.openSnackBar(`Pas de robot ou de fichier sélectionné`, true);
      return;
    }
    this.filesService.updateRobot(this.selectedRobotId).subscribe({
      next: (response: HttpResponse<string>) => {
        console.log("Response:", response);
        console.log("Response code:", response.status);
        console.log("Response body:", response.body);
        this.openSnackBar(`Robot ${this.selectedRobotId} est en cour de mise à jours...`);
      },
      error: (error) => {
        console.error("Error:", error);
        this.openSnackBar(`Erreur lors de la mise à jours du Robot ${this.selectedRobotId}`, true);
      }
    });
  }

  openSnackBar(message: string, error = false) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: error ? ['error-message'] : ['success-message']
    });
  }

  hasChild = (_: number, node: FilesTreeNode) => !!node.children && node.children.length > 0;

  refresh() {
    this.wasRobotChose = false;
  }

  openDialog() {
    return this.dialog.open(ConfirmationDialogComponent).afterClosed();
  }

  get robots() {
    return this.filesService.robots;
  }
}
