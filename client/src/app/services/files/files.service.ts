import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import { FilesTreeNode } from '@app/interfaces/files-tree';

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class FilesService {
    
    constructor(private readonly http: HttpClient) {}

    getFileTree(robotId: number): Observable<HttpResponse<string>> {
        return this.http.get<string>(localUrl(`files/tree/${robotId}`), { observe: 'response', responseType: 'json' });
    }

    getFile(robotId: number, file: FilesTreeNode): Observable<HttpResponse<object>> {
        const params = { robot_id: robotId, name: file.name, id: file.id }; // Construct query parameters
        return this.http.get<object>(localUrl(`files/file`), {
            params,
            observe: 'response',
            responseType: 'json'
        });
    }

    saveFile(robotId: number, file: FilesTreeNode, content: string): Observable<HttpResponse<string>> {
        return this.http.post(localUrl(`files/save/${robotId}`),{ name: file.name, id: file.id, content: content }, { observe: 'response', responseType: 'text' });
    }

    updateRobot(robotId: number): Observable<HttpResponse<string>> {
        return this.http.patch(localUrl(`files/update/${robotId}`), null, { observe: 'response', responseType: 'text' });
    }

    missionStatus(): Observable<HttpResponse<boolean>> {
        return this.http.get<boolean>(localUrl(`mission/status`), { observe: 'response', responseType: 'json' });
    }

}