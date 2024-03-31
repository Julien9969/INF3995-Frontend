import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import { FilesTreeNode } from '@app/classes/files-tree';
import {RobotsService} from "@app/services/robots/robots.service";
import {RobotInformation} from "@common";

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  robots: BehaviorSubject<RobotInformation[]> = new BehaviorSubject<RobotInformation[]>([]);
  constructor(private readonly http: HttpClient,
              private readonly robotsService: RobotsService) {
    this.robotsService.robots.subscribe(robots => this.robots.next(robots));
  }

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
}
