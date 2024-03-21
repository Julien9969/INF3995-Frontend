/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdeComponent } from './ide.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FilesService } from '@app/services/files/files.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FilesTree } from '@app/interfaces/files-tree';
import { MissionService } from '@app/services/mission/mission.service';
import { MissionState } from '@app/classes/mission-status';

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
  let missionServiceMock: jasmine.SpyObj<MissionService>;
  let mockResponse: HttpResponse<any>;
  let mockResponse2: HttpResponse<any>;

  beforeEach(async () => {
    filesServiceSpy = jasmine.createSpyObj('FilesService', ['getFileTree', 'saveFile', 'getFile', 'updateRobot']);
    missionServiceMock = jasmine.createSpyObj('MissionService', ['status']);
    missionServiceMock.status.getValue = jasmine.createSpy('getValue').and.returnValue({ missionState: MissionState.NOT_STARTED });
    mockResponse = new HttpResponse({ status: 200, body: { content: 'Test content'}});
    mockResponse2 = new HttpResponse({ status: 200, body: JSON.stringify(fileTreeMock)});



    filesServiceSpy.getFileTree.and.returnValue(of(mockResponse2));
    filesServiceSpy.saveFile.and.returnValue(of(mockResponse));
    filesServiceSpy.getFile.and.returnValue(of(mockResponse));
    filesServiceSpy.updateRobot.and.returnValue(of(mockResponse));
    
    await TestBed.configureTestingModule({
      imports: [IdeComponent, MatSnackBarModule, BrowserAnimationsModule, BrowserModule],
      providers: [{ provide: FilesService, useValue: filesServiceSpy }, { provide: MissionService, useValue: missionServiceMock }]
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

    filesServiceSpy.getFileTree.and.callFake(() => { throw new Error(errorMessage); });
    spyOn(component, 'openSnackBar');
        
    component.onRobotSelected();

    expect(filesServiceSpy.getFileTree).toHaveBeenCalledWith(1);
    expect(component.openSnackBar).toHaveBeenCalledWith(`Erreur lors de la récupération de l'arbre de fichier du robot ${component.selectedRobotId}`, true);
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

  it('should not save file if mission is ongoing', () => {
    component.selectedRobotId = 1;
    component.currentFile = { id: 1, name: 'testFile.txt' };
    missionServiceMock.status.getValue = jasmine.createSpy('getValue').and.returnValue({ missionState: MissionState.ONGOING });
    spyOn(component, 'openSnackBar');

    component.saveFile();

    expect(filesServiceSpy.saveFile).not.toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith(`Impossible de sauvegarder le fichier pendant une mission`, true);
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

  it('should not update robot when mission is ongoing', () => {
    component.selectedRobotId = 1;
    component.currentFile = { id: 1, name: 'testFile.txt' };
    missionServiceMock.status.getValue = jasmine.createSpy('getValue').and.returnValue({ missionState: MissionState.ONGOING });
    spyOn(component, 'openSnackBar');

    component.updateRobot();

    expect(filesServiceSpy.updateRobot).not.toHaveBeenCalled();
    expect(component.openSnackBar).toHaveBeenCalledWith(`Impossible de mettre à jours le robot ${component.selectedRobotId} pendant une mission`, true);
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

  it('should return true if mission ongoing', () => {
    missionServiceMock.status.getValue = jasmine.createSpy('getValue').and.returnValue({ missionState: MissionState.ONGOING });

    expect(component.isMissionOnGoing()).toBeTrue();
  });
});
