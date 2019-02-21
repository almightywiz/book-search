import { Injectable } from '@angular/core';
import { OpenLibraryService } from './open-library-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryBooksService extends OpenLibraryService {
  protected static readonly API_URL = OpenLibraryService.BASE_API_URL + '/books';

  constructor(private http: HttpClient) {
    super();
  }

  getBookData(id: string) {
    return this.http.get(
      OpenLibraryBooksService.API_URL + '?format=json&jscmd=data&bibkeys=OLID:' + id
    );
  }

}
