import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environmentExt} from "@environment-ext";
import { FilesTree } from '@app/interfaces/files-tree';

const localUrl = (call: string) => `${environmentExt.apiUrl}${call}`;

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  constructor(private http: HttpClient) {
  }

    getFileTree(): Observable<FilesTree> {
        return this.http.get<FilesTree>(localUrl(`files/tree`), { responseType: 'json' });
    }

    getFile(fileName: string): Observable<string> {
        return this.http.post(localUrl(`files/file/${fileName}`), { responseType: 'text' })
        .pipe(
            map(response => response.toString())
        );
    }
}