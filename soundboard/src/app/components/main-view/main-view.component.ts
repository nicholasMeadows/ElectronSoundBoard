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
  soundcards: SoundCard[] = [];
  currentlyPlayingCard: SoundCard;
  runTimeId: number = 0;
  constructor(private cd: ChangeDetectorRef, private soundCardService: SoundcardService, private settingsService: SettingsService, private ipcService: IpcService, private audioService: AudioService) { }

  ngOnInit(): void {
      this.loadData();
  }

  loadData() {
    this.soundCardService.loadSoundCards().subscribe(soundCards => {
      this.soundcards = soundCards;
    });
  }

  hasFavorites() {
    let hasFavorites = this.soundcards.map(soundcard => soundcard.isFavorite).filter((value, index, self) => value == true);
    return !(hasFavorites.length == 0);
  }

  hasStreamDeckItems() {
    let hasStreamDeckItems = this.soundcards.map(soundcard => soundcard.showOnStreamDeck).filter((value, index, self) => value == true);
    return !(hasStreamDeckItems.length == 0);
  }

  findSoundCardAndSetIsPlaying(soundCard: SoundCard) {
    let idToFind = soundCard.runTimeId;

    let foundSoundCard = this.soundcards.find((soundcard, index) => {
      return soundcard.runTimeId == idToFind;
    })
    foundSoundCard.isCurrentlyPlaying = false;
    this.cd.detectChanges();
  }

  getCategories() {
    return this.soundcards.map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        }
        return 0;
      });
  }
  getFavoritesCategory() {
    let favoritesCategory = this.soundcards.filter((val) => val.isFavorite).map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    });;
    return favoritesCategory;
  }

  getStreamDeckCategory() {
    let favoritesCategory = this.soundcards.filter((val) => val.showOnStreamDeck).map(soundcard => soundcard.category).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
      return 0;
    });;
    return favoritesCategory;
  }
}