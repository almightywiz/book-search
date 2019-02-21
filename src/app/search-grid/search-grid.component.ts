import { Component, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OpenLibrarySearchResponse } from '../open-library-search-response';
import { OpenLibrarySearchService } from '../open-library-search.service';
import * as tokenizer from 'search-text-tokenizer';
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-search-grid',
  templateUrl: './search-grid.component.html',
  styleUrls: ['./search-grid.component.css']
})
export class SearchGridComponent implements AfterViewInit {

  search = new FormControl('');
  columnDefs = [
    { headerName: 'Cover', field: 'cover_edition_key', sortable: false, filter: false, cellRenderer: this.cellRendererCover},
    { headerName: 'Title', field: 'title'},
    { headerName: 'Author', field: 'author_name'},
    { headerName: '# of Editions', field: 'edition_count', filter: false }
  ];

  gridOptions: GridOptions;
  SUPPORTED_SEARCH_OPTIONS = OpenLibrarySearchService.SUPPORTED_SEARCH;

  /**
   * Provide HTML rendering for cover cell to an IMG tag.
   *
   * @param   params  List of event parameters
   *
   * @return  An IMG tag if there is a cover value; empty string if not.
   */
  cellRendererCover(params): string {
    if (params.value) {
      return '<img src="http://covers.openlibrary.org/b/olid/' + params.value + '-S.jpg" />';
    }
    return '';
  }

  constructor(private route: ActivatedRoute, private openLibraryService: OpenLibrarySearchService, private router: Router) {
    this.gridOptions = {
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
      },

      rowSelection: 'single',
      rowHeight: 600 / 9,
      rowData: [],
      columnDefs: this.columnDefs,
      onGridReady: this.agGridOnReady.bind(this),
      onRowSelected: this.agGridRowSelected.bind(this),
      pagination: true,
      paginationAutoPageSize: true
    };
  }

  agGridOnReady(params): void {
    this.gridOptions = params;
  }

  agGridRowSelected(params): void {
    if (params.node.isSelected()) {
      const key = params.node.data.cover_edition_key || params.node.data.edition_key[0];
      this.router.navigate(['/detail', key]);
    }
  }

  /**
   * Perform API search based on the 's' URL parameter.
   */
  performSearch(): void {
    if (this.route.snapshot.queryParamMap.has('s')) {
      this.gridOptions.api.setSortModel([{colId: 'title', sort: 'asc'}]);
      this.gridOptions.api.setRowData([]);
      this.gridOptions.api.showLoadingOverlay();
      const terms = tokenizer(this.route.snapshot.queryParamMap.get('s'));
      this.search.setValue(this.route.snapshot.queryParamMap.get('s'));

      this.openLibraryService
        .getDocuments(terms)
        .then(res => res.subscribe((response: OpenLibrarySearchResponse) => {
          this.gridOptions.api.setRowData(response.docs);
        }));
    }
  }

  /**
   * Perform API search by injecting the search query string diretly into the URL.
   *
   * This allows for bookmarking searches.
   */
  onSearchClick(): void {
    this.router.navigate(['/search'], {queryParams: { s: this.search.value }}).then( () => this.performSearch());
  }

  ngAfterViewInit() {
    this.performSearch();
  }
}
