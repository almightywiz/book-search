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

  public static readonly SUPPORTED_SEARCH = [
    'author',
    'title',
    'text',
    'subject'
  ];

  private static readonly DEFAULT_SEARCH_CRIT = 'q';
  private static readonly SEARCH_TERM_TAG = 'tag';
  private static readonly SEARCH_TERM_TERM = 'term';

  constructor(private http: HttpClient) {
    super();
  }

  prepSearchTermCollection(searchTerms: object): void {
    searchTerms[OpenLibrarySearchService.DEFAULT_SEARCH_CRIT] = '';
    for (const crit of OpenLibrarySearchService.SUPPORTED_SEARCH) {
      searchTerms[crit] = '';
    }
  }

  getDocuments(terms: object[]) {
    const searchTerms = this.generateSearchQuery(terms);
    const lim = 'limit=0';

    /*
      Perform 2 requests; the first to determine the total number of documents
      exist for the current criteria, and the second to retrieve all data.

      It should be noted that if the total number of records exceeds 1000,
      then the limit will be capped at 1000.
     */
    return this.http
      .get<OpenLibrarySearchResponse>(
        OpenLibrarySearchService.SEARCH_URL + '?' + [lim, searchTerms].join('&')
      )
      .toPromise()
      .then(res => {
        const NUM_FOUND = 'num_found';
        const limit =
          'limit=' + (res[NUM_FOUND] > 1000 ? 1000 : res[NUM_FOUND]);

        if (res[NUM_FOUND] > 1000) {
          console.debug(
            'Search criteria is too broad, resulting in ' +
              res[NUM_FOUND] +
              ' records.  Only the first 1000 records will be viewable.'
          );
        }

        return this.http.get<OpenLibrarySearchResponse>(
          OpenLibrarySearchService.SEARCH_URL +
            '?' +
            [limit, searchTerms].join('&')
        );
      });
  }

  generateSearchQuery(terms: object[]): string {
    const searchTerms = {};

    this.prepSearchTermCollection(searchTerms);
    this.buildSearchTerms(searchTerms, terms);

    return this.consolidateSearchTerms(searchTerms);
  }

  buildSearchTerms(searchTerms: object, terms: object[]) {
    let searchTag: string;
    let searchTerm: string;
    for (const term of terms) {
      searchTag = term[OpenLibrarySearchService.SEARCH_TERM_TAG];
      searchTerm = term[OpenLibrarySearchService.SEARCH_TERM_TERM];
      if (OpenLibrarySearchService.SUPPORTED_SEARCH.includes(searchTag)) {
        searchTerms[searchTag] += ' '' + searchTerm.toString() + ''';
      } else if (searchTag == null) {
        searchTerms[OpenLibrarySearchService.DEFAULT_SEARCH_CRIT] +=
          ' '' + searchTerm.toString() + ''';
      }
    }
  }

  consolidateSearchTerms(searchTerms: object): string {
    let query = '';

    for (const key of Object.keys(searchTerms)) {
      if (searchTerms[key]) {
        query += key + '=' + searchTerms[key].trim() + '&';
      }
    }

    return query.substring(0, query.length - 1);
  }
}
