import { Component, Injectable } from '@angular/core';
import { FilterServiceService } from './filter-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  title = 'to-and-from';

  constructor(private filterService: FilterServiceService) {}
}
