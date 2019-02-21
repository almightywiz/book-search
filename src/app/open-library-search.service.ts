import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpenLibraryService } from './open-library-service';
import { OpenLibrarySearchResponse } from './open-library-search-response';

@Injectable({
  providedIn: 'root'
})
export class OpenLibrarySearchService extends OpenLibraryService {
  protected static readonly SEARCH_URL =
    OpenLibraryService.BASE_SERVICE_URL + '/search.json';

  public static readonly SUPPORTED_SEARCH = ['author', 'title', 'text', 'subject'];

  constructor(private http: HttpClient) {
    super();
  }

  getDocuments(terms: object[], limit: number) {
    const searchTerms = this.buildSearchTerms(terms);
    const lim = 'limit=' + (limit ? limit : 25);

    return this.http.get<OpenLibrarySearchResponse>(
      OpenLibrarySearchService.SEARCH_URL + '?' + [lim, searchTerms].join('&')
    );
  }

  buildSearchTerms(terms: object[]): string {
    let query = '';
    let searchTag: string;
    let searchTerm: string;
    const TAG = 'tag';
    const TERM = 'term';
    const searchTerms = {
      q : ''
    };

    for (const crit of OpenLibrarySearchService.SUPPORTED_SEARCH) {
      searchTerms[crit] = '';
    }

    for (const term of terms) {
      searchTag = term[TAG];
      searchTerm = term[TERM];
      if (OpenLibrarySearchService.SUPPORTED_SEARCH.includes(searchTag)) {
         searchTerms[searchTag] += ' "' + searchTerm.toString() + '"';
      } else if (searchTag == null) {
        searchTerms.q += ' "' + searchTerm.toString() + '"';
      }
    }

    for (const key of Object.keys(searchTerms)) {
      if (searchTerms[key]) {
        query += key + '=' + searchTerms[key].trim() + '&';
      }
    }
    return query.substring(0, query.length - 1);
  }
}
