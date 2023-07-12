import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { FilterOptions } from './interfaces/filter-interfaces';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class FilterServiceService {

  private url = 'https://api.toandfrom.com/v2/';
  private pronounUrl = `${this.url}gender?all=true&status=activate`;
  private occasionUrl = `${this.url}occasion?all=true&status=activate`;
  private relationshipUrl = `${this.url}relationship?all=true&status=activate`;

  pronoun: FilterOptions[] = Object.assign({});
  occasion: FilterOptions[] = Object.assign({});
  relationShip: FilterOptions[] = Object.assign({});

  constructor(
    private http: HttpClient
  ) {
    this.getData();
  }

  private getData() {
    this.http.get<any>(this.pronounUrl).subscribe((data: any) => {
      this.pronoun = data.data;
      for(let d of this.pronoun) {console.log(d.name); }
    });

    this.http.get<any>(this.occasionUrl).subscribe((data: any) => {
      this.occasion = data.data;
      for(let d of this.occasion) {console.log(d.name); }
    });

    this.http.get<any>(this.relationshipUrl).subscribe((data: any) => {
      this.relationShip = data.data;
      for(let d of this.relationShip) {console.log(d.name); }
    });
  }

  getPronoun() {
    return Object.assign(this.pronoun);
  }

  getOccasion() {
    return Object.assign(this.occasion);
  }

  getRelationship() {
    return Object.assign(this.relationShip);
  }

  getPronounId(name: String): String {
    return this.pronoun.find(ele => ele.name == name)?.id || '';
  }

  getOccasionId(name: String): String {
    return this.occasion.find(ele => ele.name == name)?.id || '';
  }

  getRelationshipId(name: String): String {
    return this.relationShip.find(ele => ele.name == name)?.id || '';
  }

  getPronounName(id: String): String {
    return this.pronoun.find(ele => ele.id == id)?.name || '';
  }

  getOccasionName(id: String): String {
    return this.occasion.find(ele => ele.id == id)?.name || '';
  }

  getRelationshipName(id: String): String {
    return this.relationShip.find(ele => ele.id == id)?.name || '';
  }
}
