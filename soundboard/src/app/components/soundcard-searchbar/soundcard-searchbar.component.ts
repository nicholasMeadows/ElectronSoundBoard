import { SoundcardSearchService } from './../../services/soundcard-searchbar.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soundcard-searchbar',
  templateUrl: './soundcard-searchbar.component.html',
  styleUrls: ['./soundcard-searchbar.component.css']
})
export class SoundcardSearchbarComponent implements OnInit {
  currentSearch: string;
  showSearch:boolean = false;
  constructor(private searchService: SoundcardSearchService) { }

  ngOnInit(): void {
  }

  searchBarChanged(){
    this.searchService.updateSearchCriteria(this.currentSearch);
  }

  seachButtonClicked(){
    this.showSearch = !this.showSearch;

    if(!this.showSearch){
      this.currentSearch = "";
      this.searchBarChanged();
    }
  }

  inputClickEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
