import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenLibraryBooksService } from '../open-library-books.service';
import { Location } from '@angular/common';
import { Book } from '../book';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: OpenLibraryBooksService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBook();
  }

  getBook(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookService.getBookData(id)
      .subscribe(response => {
        const keys = Object.keys(response);
        this.book = (response[keys[0]] as Book);
      });
  }

  goBack(): void {
    this.location.back();
  }

}
