import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  static readonly httpRegex =
    'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

  static readonly sampleURL =
    'https://gist.githubusercontent.com/bryanl/bf78e444419db3b78450ff35cdb99ec5/raw/ef4e0b96b762311cb4706b5f3537f95ae2ab9b37/manifest.yaml';

  constructor(private http: HttpClient) {}

  download(url): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}
