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
    { headerName: 'Cover', field: 'cover_edition_key', sortable: false, filter: false, cellRenderer: function(params) {
        if (params.value) {
          return '<img src="http://covers.openlibrary.org/b/olid/' + params.value + '-S.jpg" />';
        }
        return '';
      }
    },
    { headerName: 'Title', field: 'title'},
    { headerName: 'Author', field: 'author_name'},
    { headerName: '# of Editions', field: 'edition_count', filter: false }
  ];

  gridOptions: GridOptions;
  SUPPORTED_SEARCH_OPTIONS = OpenLibrarySearchService.SUPPORTED_SEARCH;

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
      onGridReady: function(params) {
        this.gridOptions = params;
      },
      onRowSelected: function(params) {
        if(params.node.isSelected()) {
          const key = params.node.data.cover_edition_key || params.node.data.edition_key[0];
          router.navigate(['/detail', key]);
        }
      },
      pagination: true,
      paginationAutoPageSize: true
    };
  }

  performSearch(): void {
    if (this.route.snapshot.queryParamMap.has('s')) {
      this.gridOptions.api.setSortModel([{colId: 'title', sort: 'asc'}]);
      this.gridOptions.api.setRowData([]);
      this.gridOptions.api.showLoadingOverlay();
      const terms = tokenizer(this.route.snapshot.queryParamMap.get('s'));
      this.search.setValue(this.route.snapshot.queryParamMap.get('s'));

      this.openLibraryService
        .getDocuments(terms, undefined)
        .subscribe((response: OpenLibrarySearchResponse) => {
          this.gridOptions.api.setRowData(response.docs);
        });
    }
  }

  onSearchClick(): void {
    this.router.navigate(['/search'], {queryParams: { s: this.search.value }}).then( () => this.performSearch());
  }

  ngAfterViewInit() {
    this.performSearch();
  }
}
