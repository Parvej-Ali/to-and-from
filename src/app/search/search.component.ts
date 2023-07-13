import { Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { debounceTime, pluck, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FilterData } from '../interfaces/filter-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterServiceService } from '../filter-service.service';

@Component({
  selector: 'app-search',
  template: `
    <div class="header">
      <div class="header-top">
        <button class="gift-quiz">Take Our Gifting Quiz</button>
        <div class="authenticate-btn">
          <button class="sign-up">Sign Up</button>
          |
          <button class="login">Login</button>
        </div> <!-- authenticate-btn -->
      </div> <!-- header-top -->

      <div class="header-bottom">
        <div class="filter-container">
          <button class="filter-btn" (click)="this.filterReady = !this.filterReady">Gift Filters</button>
          <select class="sort-by">Sort By
            <option>Sort By</option>
            <option>Price : Low to High</option><hr/>
            <option>Price : High to Low</option><hr/>
            <option>Hot gifts</option><hr/>
            <option>Newest</option><hr/>
            <option>Promotions</option><hr/>
            <option>To&From MarketPlace</option>
          </select> <!-- sort-by -->
        </div> <!-- filter-container -->
        <h1 class="logo">To&From</h1>

        <div class="product-show">

          <div class="search-container">
            <form class="search-form" name="searchbar" (submit)="search($event)">
              <span class="material-symbols-outlined">search</span>
              <input type="text" (focus)="this.inputReady=true" (blur)="this.inputReady=false" placeholder="Search your gift..." #searchInput name="search">
            </form> <!-- search-form -->
          </div> <!-- search-container -->

          <button><span class="material-symbols-outlined">inventory_2</span></button>
          <button><span class="material-symbols-outlined">shopping_bag</span></button>
        </div> <!-- product-show -->
      </div> <!-- header-bottom -->

      <app-gift-filter 
        *ngIf="this.filterReady"
        [pronoun]="pronoun"
        [occasion]="occasion"
        [relationship]="relationship"
        (applyFilters)="applyFilters($event)">
      </app-gift-filter>

      <div *ngIf="this.inputReady" class="search-result">
        <p>Search Results</p> <span class="result-count">results</span>
      </div> <!-- search-result -->
    </div>
  `,
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit {

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef = {} as ElementRef;

  filterReady = false;
  inputReady = false;

  pronoun = '';
  occasion = '';
  relationship = '';

  constructor(
    private filterService: FilterServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.getProductFilters();
  }

  getProductFilters(): void {
    this.filterService.loadPronoun().subscribe((data: any) => {
      this.filterService.setPronoun(data.data);
      this.pronoun = this.filterService.getPronounName(this.activatedRoute.snapshot.queryParamMap.get('gender')||'').toString();
    });
    this.filterService.loadOccasion().subscribe((data: any) => {
      this.filterService.setOccasion(data.data);
      this.occasion = this.filterService.getOccasionName(this.activatedRoute.snapshot.queryParamMap.get('occasion') || '').toString();
    })
    this.filterService.loadRelationship().subscribe((data: any) => {
      this.filterService.setRelationship(data.data);
      this.relationship = this.filterService.getRelationshipName(this.activatedRoute.snapshot.queryParamMap.get('relationship') || '').toString();
    });
    console.log(this.activatedRoute.snapshot.queryParamMap.get('gender'));
    console.log(this.activatedRoute.snapshot.queryParamMap.get('occasion'));
    console.log(this.activatedRoute.snapshot.queryParamMap.get('relationship'));
  }

  ngAfterViewInit(): void {
    let term = '';
    // debugger
    const searchInput$ = fromEvent(this.searchInput.nativeElement, 'keyup');
    searchInput$.pipe(
      debounceTime(500),
      pluck('target','value'),
      distinctUntilChanged(),
      switchMap( value =>
        ajax.getJSON(`https://api.toandfrom.com/v2/product?search=${value}&limit=4`)
      )
    ).subscribe(value => console.log(value));
  }

  search(event: any) {
    event.preventDefault();
  }

  applyFilters(data: FilterData){
    console.log(data);

    let params: {gender?: String, occasion?: String, relationship?: String} = {};

    if(this.filterService.getPronounId(data.pronoun) !== '') {
      this.pronoun = data.pronoun;
      params.gender = this.filterService.getPronounId(data.pronoun);
    }
    if(this.filterService.getOccasionId(data.occasion) !== '') {
      this.occasion = data.occasion;
      params.occasion = this.filterService.getOccasionId(data.occasion);
    }
    if(this.filterService.getRelationshipId(data.relationship) !== '') {
      this.relationship = data.relationship;
      params.relationship = this.filterService.getRelationshipId(data.relationship);
    }
    this.filterReady = false;

    this.router.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: params
    });
  }
}
