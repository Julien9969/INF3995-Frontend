import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environmentExt} from "@environment-ext";

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

    getFile(fileName: string): Observable<string> {
        return this.http.post(localUrl(`files/file/${fileName}`), { responseType: 'text' })
        .pipe(
            map(response => response.toString())
        );
    }

    saveFile(fileName: string, content: string): Observable<HttpResponse<string>> {
        console.log("Saving file: ", content);
        return this.http.post(localUrl(`files/save`),{ fileName: fileName, fileContent: content }, { observe: 'response', responseType: 'text' });
    }
}