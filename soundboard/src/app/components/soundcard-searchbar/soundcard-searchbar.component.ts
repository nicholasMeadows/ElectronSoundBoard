import { SoundcardSearchService } from './../../services/soundcard-searchbar.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-soundcard-searchbar',
  templateUrl: './soundcard-searchbar.component.html',
  styleUrls: ['./soundcard-searchbar.component.css']
})
export class SoundcardSearchbarComponent implements OnInit {
  currentSearch: string;
  showSearch:boolean = false;

  @ViewChild('searchInput')
  searchInputElement: ElementRef;

  constructor(private searchService: SoundcardSearchService, private cd: ChangeDetectorRef) { }

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
    } else {
      this.cd.detectChanges();
      this.searchInputElement.nativeElement.focus();
    }
  }

  inputClickEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
