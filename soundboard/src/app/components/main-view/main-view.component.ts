import { MainviewSearchbarService } from './../../services/mainview-searchbar.service';
import { SoundcardService } from './../../services/soundcard.service';
import { Config } from './../../models/config';
import { SettingsService } from './../../services/settings.service';
import { SoundCard } from './../../models/soundcard';
import { AudioService } from './../../services/audio.service';
import { AudioDevice } from './../../models/audiodevice';
import { IpcService } from './../../services/ipc-service.service';

import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  isSearching: boolean = false;
  constructor(private searchService: MainviewSearchbarService){}
  ngOnInit(){
    this.searchService.getUpdateSearchBS().subscribe(searchCriteria => {
      if(searchCriteria.trim().length == 0){
        this.isSearching = false;
      } else {
        this.isSearching = true;
      }
    });
  }
  // soundcards: SoundCard[] = [];
  // uiSoundCards: SoundCard[] = [];

  // // currentSearch: string = "";

  // constructor(private cd: ChangeDetectorRef, private soundCardService: SoundcardService, private searchBarService: MainviewSearchbarService) { }

  // ngOnInit(): void {
  //   this.loadData();
  //   this.searchBarService.getUpdateSearchObservable().subscribe(searchCriteria => this.filterSoundCards(searchCriteria))
  // }

  // loadData() {
  //   this.soundCardService.loadSoundCards().subscribe(soundCards => {
  //     this.soundcards = soundCards;
  //     this.uiSoundCards = this.soundcards;
  //   });
  // }

  // hasFavorites() {
  //   let hasFavorites = this.uiSoundCards.map(soundcard => soundcard.isFavorite).filter((value, index, self) => value == true);
  //   return !(hasFavorites.length == 0);
  // }

  // hasStreamDeckItems() {
  //   let hasStreamDeckItems = this.uiSoundCards.map(soundcard => soundcard.showOnStreamDeck).filter((value, index, self) => value == true);
  //   return !(hasStreamDeckItems.length == 0);
  // }

  // findSoundCardAndSetIsPlaying(soundCard: SoundCard) {
  //   let idToFind = soundCard.runTimeId;

  //   let foundSoundCard = this.uiSoundCards.find((soundcard, index) => {
  //     return soundcard.runTimeId == idToFind;
  //   })
  //   foundSoundCard.isCurrentlyPlaying = false;
  //   this.cd.detectChanges();
  // }

  // getCategories() {
  //   return this.uiSoundCards.map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index)
  //     .sort((a, b) => {
  //       if (a > b) {
  //         return 1;
  //       } else if (a < b) {
  //         return -1;
  //       }
  //       return 0;
  //     });
  // }
  // getFavoritesCategory() {
  //   let favoritesCategory = this.uiSoundCards.filter((val) => val.isFavorite).map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => {
  //     if (a > b) {
  //       return 1;
  //     } else if (a < b) {
  //       return -1;
  //     }
  //     return 0;
  //   });;
  //   return favoritesCategory;
  // }

  // getStreamDeckCategory() {
  //   let favoritesCategory = this.uiSoundCards.filter((val) => val.showOnStreamDeck).map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => {
  //     if (a > b) {
  //       return 1;
  //     } else if (a < b) {
  //       return -1;
  //     }
  //     return 0;
  //   });;
  //   return favoritesCategory;
  // }

  // filterSoundCards(searchCriteria) {
  //   if (searchCriteria.trim().length != 0) {
  //     this.uiSoundCards = this.soundcards.filter(soundcard => {
  //       return soundcard.title.startsWith(searchCriteria);
  //     })
  //   } else {
  //     this.uiSoundCards = this.soundcards;
  //   }
  // }
}