import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterServiceService } from '../filter-service.service';

@Component({
  selector: 'app-gift-filter',
  template: `
    <form class="filter-form" novalidate [formGroup]="filterForm" (ngSubmit)="OnSubmit()">
      <div class="filter-header">
        <p>Filters</p>
        <button type="submit">Apply Filters</button>
      </div>
      <div class="input-container">
        <label>Gift For*</label>
        <select formControlName="pronoun" name="pronoun">
          <option>Select pronoun</option>
        </select>
      </div>
      <div class="input-container">
        <label>Occasion</label>
        <select formControlName="occasion" name="occasion">
          <option>Select occasion</option>
        </select>
      </div>
      <div class="input-container">
        <label>Relationship</label>
        <select formControlName="relationship" name="relationship">
          <option>Select relationship</option>
        </select>
      </div>
    </form>
  `,
  styleUrls: ['./gift-filter.component.scss']
})

export class GiftFilterComponent implements AfterViewInit{

  @Input()
  pronoun = '';

  @Input()
  occasion = '';

  @Input()
  relationship = '';

  filterForm = this.formBuilder.group({
    pronoun: this.pronoun,
    occasion: this.occasion,
    relationship: this.relationship
  });

  constructor(
    private formBuilder: FormBuilder,
    private filterService: FilterServiceService
  ) {}

  ngAfterViewInit(): void {
    console.log(this.filterService.getOccasion(),this.filterService.getPronoun(),this.filterService.getRelationship());
  }

  OnSubmit(): void {
    console.log(this.filterForm.value);
    this.filterForm.value.occasion = 'Select pronoun'
  }

}
