import { Component, AfterViewInit, ViewChild, ElementRef, OnInit} from '@angular/core';
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax'
import { debounceTime, pluck, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FilterData } from '../interfaces/filter-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterServiceService } from '../filter-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef = {} as ElementRef;

  filterReady = false;
  inputReady = false;

  pronoun = '';
  occasion = '';
  relationship = '';
  sortValue = '';

  filterOutput: any[] = [];

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
      this.showFilters();
    });
    this.filterService.loadOccasion().subscribe((data: any) => {
      this.filterService.setOccasion(data.data);
      this.occasion = this.filterService.getOccasionName(this.activatedRoute.snapshot.queryParamMap.get('occasion') || '').toString();
      this.showFilters();
    })
    this.filterService.loadRelationship().subscribe((data: any) => {
      this.filterService.setRelationship(data.data);
      this.relationship = this.filterService.getRelationshipName(this.activatedRoute.snapshot.queryParamMap.get('relationship') || '').toString();
      this.showFilters();
    });

    if(this.activatedRoute.snapshot.queryParamMap.get('order') == 'ASC') {
      this.sortValue = 'ASCPrice';
    }else if(this.activatedRoute.snapshot.queryParamMap.get('order') == 'DESC') {
      this.sortValue = 'DESCPrice';
    } else {
      this.sortValue = this.activatedRoute.snapshot.queryParamMap.get('orderby') || '';
    }
    console.log('Pronoun Id      :', this.activatedRoute.snapshot.queryParamMap.get('gender'));
    console.log('Occasion Id     :', this.activatedRoute.snapshot.queryParamMap.get('occasion'));
    console.log('Relationship Id :', this.activatedRoute.snapshot.queryParamMap.get('relationship'));
    console.log('Order           :', this.activatedRoute.snapshot.queryParamMap.get('order'));
    console.log('OrderBy         :', this.activatedRoute.snapshot.queryParamMap.get('orderby'));
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(value => {
      // this.pronoun = this.filterService.getPronounName(value['gender'] || '').toString();
      // this.occasion = this.filterService.getPronounName(value['occasion'] || '').toString();
      // this.relationship = this.filterService.getPronounName(value['relationship'] || '').toString();
      console.log('Url params', value);
    });
  }

  showFilters() {
    this.filterOutput = [];
    if(this.pronoun != '') this.filterOutput.push(['gender', this.pronoun]);
    if(this.occasion != '') this.filterOutput.push(['occasion', this.occasion]);
    if(this.relationship != '') this.filterOutput.push(['relationship', this.relationship]);
    if(this.sortValue != '') {
      if(this.sortValue == 'ASCPrice') {
        this.filterOutput.push(['orderby', 'Price : Low to High']);
      }else if(this.sortValue == 'DESCPrice') {
        this.filterOutput.push(['orderby', 'Price : High to Low']);
      } else if(this.sortValue == 'hotgift') {
        this.filterOutput.push(['orderby', 'Hot gifts']);
      } else if(this.sortValue == 'newest') {
        this.filterOutput.push(['orderby', 'Newest']);
      } else if(this.sortValue == 'discount_percentage') {
        this.filterOutput.push(['orderby', 'Promotions']);
      }  else {
        this.filterOutput.push(['orderby', 'To&From MarketPlace']);
      }
    }
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

    let params: {gender?: any, occasion?: any, relationship?: any} = {};
    params.gender = this.filterService.getPronounId(data.pronoun);
    params.occasion = this.filterService.getOccasionId(data.occasion);
    params.relationship = this.filterService.getRelationshipId(data.relationship);
    this.pronoun = data.pronoun;
    this.occasion = data.occasion;
    this.relationship = data.relationship;
    this.filterReady = false;

    this.navigateUrlWithMerge(params);
    this.showFilters();
  }
  
  sortBy(value: string) {
    let params: {order?: any, orderby?: any} = {};
    params.order = null;
    params.orderby = null;
    if(value == 'ASCPrice') {
      params.order = 'ASC';
      params.orderby = 'price';
    } else if (value == 'DESCPrice') {
      params.order = 'DESC';
      params.orderby = 'price';
    } else {
      params.orderby = value;
    }
    this.navigateUrlWithMerge(params);
    this.sortValue = value;
    this.showFilters();
  }

  deleteFilter(value: string) {
    this.filterOutput = this.filterOutput.filter(item => item != value);
    let params: {gender?: any, occasion?: any, relationship?: any, order?: any, orderby?: any} = {};
    if(value[0] == 'gender') {params.gender = null;this.pronoun = '';}
    if(value[0] == 'occasion') {params.occasion = null;this.occasion = '';}
    if(value[0] == 'relationship') {params.relationship = null;this.relationship = '';}
    if(value[0] == 'orderby') {params.order = null;params.orderby = null;this.sortValue = '';}
    this.navigateUrlWithMerge(params);
  }

  clearFilters() {
    let params: {gender?: any, occasion?: any, relationship?: any, order?: any, orderby?: any} = {};
    params.gender = null;
    this.pronoun = '';
    params.occasion = null;
    this.occasion = '';
    params.relationship = null;
    this.relationship = '';
    params.order = null;
    params.orderby = null;
    this.sortValue = '';
    this.filterOutput = [];

    this.navigateUrlWithMerge(params);
  }
  
  private navigateUrlWithMerge(params: any) {
    this.router.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: params, 
      queryParamsHandling: 'merge'
    });
  }
}
