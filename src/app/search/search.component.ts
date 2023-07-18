import { Component, AfterViewInit, ViewChild, ElementRef, OnInit} from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, pluck, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterServiceService } from '../filter-service.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef = {} as ElementRef;

  filterReady = false;
  inputReady = false;
  priceRange = false;
  loading = false;
  productCount = 0;

  sortValue = '';
  formInput = this.filterService.getFilterForm();

  filterOutput: any[] = [];
  productData: any = [];

  constructor(
    private filterService: FilterServiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { 
    this.getProductFilters();
  }

  getProductFilters(): void {
    this.filterService.loadPronoun().subscribe({
      next: (data: any) => {
        this.filterService.setPronoun(data.data);
        this.formInput.controls['pronoun'].setValue(this.filterService.getPronounName(this.activatedRoute.snapshot.queryParamMap.get('gender')||'').toString());
        this.showFilters();
      }
    });
    this.filterService.loadOccasion().subscribe((data: any) => {
      this.filterService.setOccasion(data.data);
      this.formInput.controls['occasion'].setValue(this.filterService.getOccasionName(this.activatedRoute.snapshot.queryParamMap.get('occasion') || '').toString());
      this.showFilters();
    })
    this.filterService.loadRelationship().subscribe((data: any) => {
      this.filterService.setRelationship(data.data);
      this.formInput.controls['relationship'].setValue(this.filterService.getRelationshipName(this.activatedRoute.snapshot.queryParamMap.get('relationship') || '').toString());
      this.showFilters();
    });


    if(this.activatedRoute.snapshot.queryParamMap.get('minPrice') != null) this.formInput.rangeStart = this.activatedRoute.snapshot.queryParamMap.get('minPrice');
    if(this.activatedRoute.snapshot.queryParamMap.get('maxPrice') != null) this.formInput.rangeStart = this.activatedRoute.snapshot.queryParamMap.get('maxPrice');


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
    console.log('MinPrice        :', this.activatedRoute.snapshot.queryParamMap.get('minPrice'));
    console.log('MaxPrice        :', this.activatedRoute.snapshot.queryParamMap.get('maxPrice'));
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(value => {
      this.formInput.get('pronoun').setValue(this.filterService.getPronounName(value['gender'] ||'').toString());
      this.formInput.controls['occasion'].setValue(this.filterService.getOccasionName(value['occasion'] || '').toString());
      this.formInput.controls['relationship'].setValue(this.filterService.getRelationshipName(value['relationship'] || '').toString());
      if(value['minPrice'] != null) { this.formInput.rangeStart = value['minPrice']; this.priceRange = true }
      if(value['maxPrice'] != null) this.formInput.rangeEnd = value['maxPrice'];

      if(value['order'] == 'ASC') {
        this.sortValue = 'ASCPrice';
      }else if(value['order'] == 'DESC') {
        this.sortValue = 'DESCPrice';
      } else {
        this.sortValue = value['orderby'] || '';
      }
      console.log('Url params', value);
      this.showFilters();
    });
    
    this.activatedRoute.queryParams.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        this.loading = true;
        let pa = new HttpParams();
        if(value['gender'] != null) pa = pa.set('gender',value['gender']);
        if(value['occasion'] != null) pa = pa.set('occasion',value['occasion']);
        if(value['relationship'] != null) pa = pa.set('relationship',value['relationship']);
        if(value['orderby'] != null) pa = pa.set('orderby',value['orderby']);
        if(value['order'] != null) pa = pa.set('order',value['order']);
        if(value['minPrice'] != null) pa = pa.set('minPrice',value['minPrice']);
        if(value['maxPrice'] != null) pa = pa.set('maxPrice',value['maxPrice']);
        console.log(pa.toString());

        return this.filterService.getProductsData(pa.toString());
      })
    ).subscribe((value: any) => {
      console.log(value.data);
      this.productData = value.data
      this.loading = false;
      this.productCount = this.productData.length;
    });
  }

  showFilters() {
    this.filterOutput = [];
    if(this.formInput.value.pronoun != '') this.filterOutput.push(['gender', this.formInput.value.pronoun]);
    if(this.formInput.value.occasion != '') this.filterOutput.push(['occasion', this.formInput.value.occasion]);
    if(this.formInput.value.relationship != '') this.filterOutput.push(['relationship', this.formInput.value.relationship]);
    if(this.priceRange == true) this.filterOutput.push(['priceRange', 'Budget $'+this.formInput.value.rangeStart+' - $'+this.formInput.value.rangeEnd]);
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
      switchMap( value => {
        return this.filterService.getProductsData(`search=${value}`, 4);
      })
    ).subscribe(value => console.log(value));
  }

  search(event: any) {
    event.preventDefault();
  }

  applyFilters(data: any){
    console.log(data.value);

    let params: {gender?: any, occasion?: any, relationship?: any, minPrice?: any, maxPrice?: any} = {};
    params.gender = this.filterService.getPronounId(data.value.pronoun);
    params.occasion = this.filterService.getOccasionId(data.value.occasion);
    params.relationship = this.filterService.getRelationshipId(data.value.relationship);
    params.minPrice = data.value.rangeStart;
    params.maxPrice = data.value.rangeEnd;
    this.priceRange = true;
    this.formInput = data;
    this.filterReady = false;
    console.log('Form Input : ',this.formInput.value);

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
    this.filterOutput = this.filterOutput.filter(item => item[0] != value[0]);
    let params: {gender?: any, occasion?: any, relationship?: any, minPrice?: any, maxPrice?: any, order?: any, orderby?: any} = {};
    if(value[0] == 'gender') {params.gender = null;this.formInput.value.pronoun = '';}
    if(value[0] == 'occasion') {params.occasion = null;this.formInput.value.occasion = '';}
    if(value[0] == 'relationship') {params.relationship = null;this.formInput.value.relationship = '';}
    if(value[0] == 'orderby') {params.order = null;params.orderby = null;this.sortValue = '';}
    if(value[0] == 'priceRange') {params.minPrice = null;params.maxPrice = null;this.priceRange = false}
    this.navigateUrlWithMerge(params);
  }

  clearFilters() {
    let params: {gender?: any, occasion?: any, relationship?: any, minPrice?: any, maxPrice?: any, order?: any, orderby?: any} = {
      gender:null,
      occasion:null,
      relationship:null,
      minPrice: null,
      maxPrice: null,
      order: null,
      orderby: null
    };
    this.filterOutput = [];
    this.formInput = this.filterService.getFilterForm().reset();

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
