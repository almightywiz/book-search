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
    let searchTerm = '';
    let searchTerms = {
      q : ''
    };

    for (const crit of OpenLibrarySearchService.SUPPORTED_SEARCH) {
      searchTerms[crit] = '';
    }

    for (const term of terms) {
      if(OpenLibrarySearchService.SUPPORTED_SEARCH.includes(term['tag'])) {
         searchTerms[term['tag']] += ' "' + term['term'].toString() + '"';
      }
      else if (term["tag"] == null) {
        searchTerms.q += ' "' + term['term'].toString() + '"';
      }
    }

    for(const key of Object.keys(searchTerms)) {
      if (searchTerms[key]) {
        searchTerm += key + '=' + searchTerms[key].trim() + '&';
      }
    }
    return searchTerm.substring(0, searchTerm.length - 1);
  }
}
