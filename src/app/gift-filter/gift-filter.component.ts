import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FilterServiceService } from '../filter-service.service';
import { FilterData, FilterOptions } from '../interfaces/filter-interfaces';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gift-filter',
  templateUrl: './gift-filter.component.html',
  styleUrls: ['./gift-filter.component.scss']
})

export class GiftFilterComponent implements OnChanges{

  @Input()
  formDemo!: FormGroup;

  filterForm = this.filterService.getFilterForm();

  @Output()
  applyFilters: EventEmitter<FilterData> = new EventEmitter();

  priceContainer = '--';

  pronounData: FilterOptions[] = [];
  occasionData: FilterOptions[] = [];
  relationshipData: FilterOptions[] = [];

  constructor(
    private filterService: FilterServiceService
  ) {
    console.log(this.filterForm?.value);
    this.pronounData = this.filterService.getPronoun();
    this.occasionData = this.filterService.getOccasion();
    this.relationshipData = this.filterService.getRelationship();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterForm.setValue(changes['formDemo'].currentValue.value);
    console.log(this.filterForm === this.formDemo)
    console.log('OnChange : ', this.filterForm.value);
  }

  OnSubmit(): void {
    this.applyFilters.emit(Object.assign(this.filterForm));
  }

  formatLabel(value: Number): string {
    return '$'+value;
  }
}
