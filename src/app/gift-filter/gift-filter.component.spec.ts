import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftFilterComponent } from './gift-filter.component';

describe('GiftFilterComponent', () => {
  let component: GiftFilterComponent;
  let fixture: ComponentFixture<GiftFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiftFilterComponent]
    });
    fixture = TestBed.createComponent(GiftFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
