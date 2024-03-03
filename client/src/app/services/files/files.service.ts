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
  constructor(private http: HttpClient) {
  }

    getFileTree(): Observable<HttpResponse<string>> {
        return this.http.get<string>(localUrl(`files/tree`), { observe: 'response', responseType: 'json' });
    }

    getFile(file: FilesTreeNode): Observable<HttpResponse<object>> {
        const params = { name: file.name, id: file.id }; // Construct query parameters
        return this.http.get<object>(localUrl(`files/file`), {
            params, // Include query parameters
            observe: 'response',
            responseType: 'json'
        });
    }

    saveFile(fileName: string, content: string): Observable<HttpResponse<string>> {
        console.log("Saving file: ", content);
        return this.http.post(localUrl(`files/save`),{ name: fileName, content: content }, { observe: 'response', responseType: 'text' });
    }
}