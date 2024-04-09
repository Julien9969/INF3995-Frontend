import { TestBed } from '@angular/core/testing';
import { FilesService } from './files.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { FilesTreeNode } from '@app/classes/files-tree';
import { environmentExt } from '@environment-ext';

describe('FilesService', () => {
  let service: FilesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(FilesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve file tree', () => {
    const mockResponse: string = 'mock response';
    const robotId: number = 1;

    service.getFileTree(robotId).subscribe((response: HttpResponse<string>) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environmentExt.apiUrl}files/tree/${robotId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should retrieve file', () => {
    const mockFile: FilesTreeNode = { id: 1, name: 'mockFile.txt' };
    const mockResponse: object = { content: 'mock content' };
    const robotId: number = 1;

    service.getFile(robotId, mockFile).subscribe((response: HttpResponse<object>) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environmentExt.apiUrl}files/file?robot_id=${robotId}&name=${mockFile.name}&id=${mockFile.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should save file', () => {
    const mockFile: FilesTreeNode = { id: 1, name: 'mockFile.txt' };
    const mockContent: string = 'mock content';
    const mockResponse: string = 'File saved successfully';
    const robotId: number = 1;

    service.saveFile(robotId, mockFile, mockContent).subscribe((response: HttpResponse<string>) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environmentExt.apiUrl}files/save/${robotId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: mockFile.name, id: mockFile.id, content: mockContent });
    req.flush(mockResponse);
  });

  it('should update robot', () => {
    const mockResponse: string = 'Robot updated successfully';
    const robotId: number = 1;

    service.updateRobot(robotId).subscribe((response: HttpResponse<string>) => {
      expect(response.body).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environmentExt.apiUrl}files/update/${robotId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });
});
