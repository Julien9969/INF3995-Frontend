/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdeComponent } from './ide.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FilesService } from '@app/services/files/files.service';
import {BehaviorSubject, of, throwError} from 'rxjs';
import {HttpClientModule, HttpResponse} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FilesTree } from '@app/classes/files-tree';
import {Component} from "@angular/core";
import {Logs, RobotInformation} from "@common";

const fileTreeMock: FilesTree = [
    {
      id: 2,
      name: 'folder1',
      children: [
        { id: 3, name: 'file1.txt', children: null },
        { id: 4, name: 'file2.txt', children: null }
      ]
    },
    {
      id: 5,
      name: 'folder2',
      children: [
        { id: 6, name: 'file3.txt', children: null },
        { id: 7, name: 'file4.txt', children: null }
      ]
    }
  ];

describe('IdeComponent', () => {
  let component: IdeComponent;
  let fixture: ComponentFixture<IdeComponent>;
  let filesServiceSpy: jasmine.SpyObj<FilesService>;
  let mockResponse: HttpResponse<any>;
  let mockResponse2: HttpResponse<any>;

  beforeEach(async () => {
    filesServiceSpy = jasmine.createSpyObj('FilesService', ['getFileTree', 'saveFile', 'getFile', 'updateRobot'], { robots: new BehaviorSubject([] as RobotInformation[]) });
    mockResponse = new HttpResponse({ status: 200, body: { content: 'Test content'}});
    mockResponse2 = new HttpResponse({ status: 200, body: JSON.stringify(fileTreeMock)});

    filesServiceSpy.getFileTree.and.returnValue(of(mockResponse2));
    filesServiceSpy.saveFile.and.returnValue(of(mockResponse));
    filesServiceSpy.getFile.and.returnValue(of(mockResponse));
    filesServiceSpy.updateRobot.and.returnValue(of(mockResponse));
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [IdeComponent, MatSnackBarModule, BrowserAnimationsModule, BrowserModule, HttpClientModule],
      providers: [{ provide: FilesService, useValue: filesServiceSpy }, {
        provide: MatSnackBarModule,
        useValue: {
          open() {
            return {
              afterClose() {
                return of('your result');
              }
            };
          }
        }

      }, {
        provide: FilesService, useValue: filesServiceSpy
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(IdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getFileTree when onRobotSelected is called', () => {
    component.selectedRobotId = 1;

    component.onRobotSelected();

    expect(filesServiceSpy.getFileTree).toHaveBeenCalledWith(1);
  });

  it('should not call getFileTree when selectedRobotId is null', () => {
    component.selectedRobotId = null;

    component.onRobotSelected();

    expect(filesServiceSpy.getFileTree).not.toHaveBeenCalled();
  });

  it('should handle error when getFileTree fails', () => {
    const errorMessage = 'Test error message';
    component.selectedRobotId = 1;
    filesServiceSpy.getFileTree.and.throwError(errorMessage);
    spyOn(component, 'openSnackBar');
    try{
      component.onRobotSelected();
    } catch (e) {
      expect(filesServiceSpy.getFileTree).toHaveBeenCalledWith(1);
      expect(component.openSnackBar).toHaveBeenCalledWith(`Erreur lors de la récupération de l'arbre de fichier du robot ${component.selectedRobotId}`, true);
    }
  });

  it('should handle error when getFileTree fails', () => {
    const errorMessage = 'Test error message';
    component.selectedRobotId = 1;

    filesServiceSpy.getFileTree.and.returnValue(throwError(() => errorMessage));
    spyOn(component, 'openSnackBar');

    component.onRobotSelected();

    expect(filesServiceSpy.getFileTree).toHaveBeenCalledWith(1);
    expect(component.openSnackBar).toHaveBeenCalledWith(`Erreur lors de la récupération de l'arbre de fichier du robot ${component.selectedRobotId}`, true);
  });

  it('should call saveFile when saveFile is called', () => {
    component.selectedRobotId = 1;
    component.currentFile = { id: 1, name: 'testFile.txt' };
    component.codeEditorContent = 'Test content';

    component.saveFile();

    expect(filesServiceSpy.saveFile).toHaveBeenCalledWith(1, component.currentFile, component.codeEditorContent);
  });

  it('should not call saveFile when selectedRobotId is null', () => {
    component.selectedRobotId = null;
    component.currentFile = { id: 1, name: 'testFile.txt' };

    component.saveFile();

    expect(filesServiceSpy.saveFile).not.toHaveBeenCalled();
  });

  it('should handle error when saveFile fails', () => {
    const errorMessage = 'Test error message';
    component.selectedRobotId = 1;
    component.currentFile = { id: 1, name: 'testFile.txt' };

    filesServiceSpy.saveFile.and.returnValue(throwError(() => errorMessage));
    spyOn(component, 'openSnackBar');

    component.saveFile();

    expect(filesServiceSpy.saveFile).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith(`Erreur lors de la sauvegarde du fichier`, true);
  });

  it('should call getFile when loadFile is called', () => {
    component.selectedRobotId = 1;
    const file = { id: 1, name: 'testFile.txt', content: 'Test content'};

    component.loadFile(file);

    expect(filesServiceSpy.getFile).toHaveBeenCalledWith(1, file);
  });

  it('should not call getFile when selectedRobotId is null', () => {
    component.selectedRobotId = null;
    const file = { id: 1, name: 'testFile.txt', content: 'Test content'};

    component.loadFile(file);

    expect(filesServiceSpy.getFile).not.toHaveBeenCalled();
  });

  it('should handle error when getFile fails', () => {
    component.selectedRobotId = 1;
    const errorMessage = 'Test error message';
    filesServiceSpy.getFile.and.returnValue(throwError(() => errorMessage));
    spyOn(component, 'openSnackBar');

    component.loadFile({ id: 1, name: 'testFile.txt'});

    expect(filesServiceSpy.getFile).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith(`Erreur lors du chargement du fichier testFile.txt`, true);
  });

  it('should not call updateRobot when selectedRobotId is null', () => {
    component.selectedRobotId = null;
    component.currentFile = { id: 1, name: 'testFile.txt' };

    component.updateRobot();

    expect(filesServiceSpy.updateRobot).not.toHaveBeenCalled();
  });

  it('should call updateRobot when updateRobot is called', () => {
    component.selectedRobotId = 1;
    component.currentFile = { id: 1, name: 'testFile.txt' };

    component.updateRobot();

    expect(filesServiceSpy.updateRobot).toHaveBeenCalledWith(1);
  });

  it('should handle error when updateRobot fails', () => {
    const errorMessage = 'Test error message';
    component.selectedRobotId = 1;
    component.currentFile = { id: 1, name: 'testFile.txt' };

    filesServiceSpy.updateRobot.and.returnValue(throwError(() => errorMessage));

    spyOn(component, 'openSnackBar');

    component.updateRobot();

    expect(filesServiceSpy.updateRobot).toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith(`Erreur lors de la mise à jours du Robot ${component.selectedRobotId}`, true);
  });

  it('should open snackbar with provided message', () => {
    const message = 'Test message';

    spyOn(component["_snackBar"], 'open');

    component.openSnackBar(message);

    expect(component["_snackBar"].open).toHaveBeenCalledWith(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: ['success-message']
    });
  });

  it('should open snackbar with provided error message', () => {
    const message = 'Test error message';
    const error = true;

    spyOn(component["_snackBar"], 'open');

    component.openSnackBar(message, error);

    expect(component["_snackBar"].open).toHaveBeenCalledWith(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: ['error-message']
    });
  });
});
