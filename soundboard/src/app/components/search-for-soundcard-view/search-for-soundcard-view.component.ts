import { SoundcardService } from './../../services/soundcard.service';
import { SoundCard } from './../../models/soundcard';
import { SoundcardSearchService } from '../../services/soundcard-searchbar.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-for-soundcard-view',
  templateUrl: './search-for-soundcard-view.component.html',
  styleUrls: ['./search-for-soundcard-view.component.css']
})
export class SearchForSoundcardViewComponent implements OnInit {
  originalSoundCardRef: SoundCard[];
  uiSoundCards: SoundCard[];

  constructor(private soundcardService:SoundcardService, private searchbarComponent: SoundcardSearchService) { }

  ngOnInit(): void {
    this.originalSoundCardRef = this.soundcardService.getSoundCards();
    this.uiSoundCards = this.originalSoundCardRef;
    this.watchForSearchUpdate();
  }

  watchForSearchUpdate(){
    this.searchbarComponent.getUpdateSearchBS().subscribe(searchCriteria => {
      if(searchCriteria.trim().length == 0){
        this.uiSoundCards = this.originalSoundCardRef;
      } else {
        this.uiSoundCards = this.originalSoundCardRef.filter(sc => {
          return sc.title.includes(searchCriteria);
        });
      }
    });
  }

  getCategories() {
    return this.uiSoundCards.map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        }
        return 0;
      });
  }
}
