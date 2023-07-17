import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterServiceService } from '../filter-service.service';
import { FilterData, FilterOptions } from '../interfaces/filter-interfaces';

@Component({
  selector: 'app-gift-filter',
  templateUrl: './gift-filter.component.html',
  styleUrls: ['./gift-filter.component.scss']
})

export class GiftFilterComponent implements OnChanges{

  @Input()
  pronoun = '';

  @Input()
  occasion = '';

  @Input()
  relationship = '';

  @Output()
  applyFilters: EventEmitter<FilterData> = new EventEmitter()

  pronounData: FilterOptions[] = [];
  occasionData: FilterOptions[] = [];
  relationshipData: FilterOptions[] = [];

  filterForm = this.formBuilder.group({
    pronoun: this.pronoun,
    occasion: this.occasion,
    relationship: this.relationship
  });

  constructor(
    private formBuilder: FormBuilder,
    private filterService: FilterServiceService
  ) {
    this.pronounData = this.filterService.getPronoun();
    this.occasionData = this.filterService.getOccasion();
    this.relationshipData = this.filterService.getRelationship();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.pronoun, this.relationship, this.occasion, 'filter')
    this.filterForm.setValue({
      pronoun: this.pronoun,
    occasion: this.occasion,
    relationship: this.relationship
    });
    console.log(this.pronoun, this.occasion, this.relationship);
    console.log(this.filterForm.value);
  }

  OnSubmit(): void {
    let data: FilterData = Object.assign({
      pronoun: this.filterForm.value.pronoun,
      occasion: this.filterForm.value.occasion,
      relationship: this.filterForm.value.relationship
    });
    this.applyFilters.emit(data);
  }
}
