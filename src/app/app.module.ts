import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { GiftFilterComponent } from './gift-filter/gift-filter.component';
import { FilterServiceService } from './filter-service.service';
import { AppRoutingModule } from './app-routing.module';
import { MatSliderModule } from '@angular/material/slider';


@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    GiftFilterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSliderModule
  ],
  providers: [FilterServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
