import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterOptions } from './interfaces/filter-interfaces';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class FilterServiceService {

  private url = 'https://api.toandfrom.com/v2/';
  private pronounUrl = `${this.url}gender?all=true&status=activate`;
  private occasionUrl = `${this.url}occasion?all=true&status=activate`;
  private relationshipUrl = `${this.url}relationship?all=true&status=activate`;
  private giftUrl = 'https://www.google.com/'

  pronoun: FilterOptions[] = [];
  occasion: FilterOptions[] = [];
  relationShip: FilterOptions[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  getFilterForm(): any {
    return this.formBuilder.group({
      pronoun: '',
      occasion: '',
      relationship: '',
      rangeStart: 20,
      rangeEnd: 250
    });
  }

  loadPronoun(): Observable<any> {
    return this.http.get<any>(this.pronounUrl)
  }

  loadOccasion(): Observable<any> {
    return this.http.get<any>(this.occasionUrl)
  }

  loadRelationship(): Observable<any> {
    return this.http.get<any>(this.relationshipUrl)
  }

  getPronoun(): FilterOptions[] {
    return Object.assign(this.pronoun);
  }

  getOccasion(): FilterOptions[] {
    return Object.assign(this.occasion);
  }

  getRelationship(): FilterOptions[] {
    return Object.assign(this.relationShip);
  }

  setPronoun(data: FilterOptions[]): void {
    this.pronoun = Object.assign(data);
  }

  setOccasion(data: FilterOptions[]): void {
    this.occasion = Object.assign(data);
  }

  setRelationship(data: FilterOptions[]): void {
    this.relationShip = Object.assign(data);
  }

  getPronounId(name: String): any {
    return this.pronoun.find(ele => ele.name == name)?.id || null;
  }

  getOccasionId(name: String): any {
    return this.occasion.find(ele => ele.name == name)?.id || null;
  }

  getRelationshipId(name: String): any {
    return this.relationShip.find(ele => ele.name == name)?.id || null;
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

  getGiftsData(genderId: String, occasionId: String, relationShipId: String) {
    this.http.get<any>(this.giftUrl).subscribe((data: any) => {
      console.log(data.data);
    });
  }
}
