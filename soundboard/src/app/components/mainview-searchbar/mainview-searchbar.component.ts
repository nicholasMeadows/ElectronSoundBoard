import { MainviewSearchbarService } from './../../services/mainview-searchbar.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mainview-searchbar',
  templateUrl: './mainview-searchbar.component.html',
  styleUrls: ['./mainview-searchbar.component.css']
})
export class MainviewSearchbarComponent implements OnInit {
  currentSearch: string;

  constructor(private searchService: MainviewSearchbarService) { }

  ngOnInit(): void {
  }

  searchBarChanged(){
    this.searchService.updateSearchCriteria(this.currentSearch);
  }
}
