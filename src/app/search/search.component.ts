import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { debounceTime, pluck, distinctUntilChanged, switchMapTo, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  template: `
    <form class="search-form" name="searchbar" (submit)="search($event)">
      <input type="text" placeholder="Search your gift..." #searchInput name="search">
    </form>
    <div *ngIf="searchInput.value.length" class="search-result">
      <p>Search Results</p> <span class="result-count">results</span>
    </div>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit {

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef = {} as ElementRef;

  ngAfterViewInit(): void {
    // let term = '';
    // // debugger
    // const searchInput$ = fromEvent(this.searchInput.nativeElement, 'keyup');
    // searchInput$.pipe(
    //   debounceTime(500),
    //   pluck('target','value'),
    //   distinctUntilChanged(),
    //   // switchMapTo(
    //   //   ajax.getJSON('https://api.toandfrom.com/v2/product?search=ear&limit=4')
    //   // ),
    // ).subscribe({next : value => console.log(ajax.getJSON(`https://api.toandfrom.com/v2/product?search=${value}&limit=4`))});
  }

  search(event: any) {
    event.preventDefault();
  }

}
