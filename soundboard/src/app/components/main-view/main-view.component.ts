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
  constructor(private cd: ChangeDetectorRef, private settingsService: SettingsService, private ipcService: IpcService, private audioService: AudioService) { }

  ngOnInit(): void {
    this.audioService.getAudioFinishedSubscription().subscribe(soundCard => {
      console.log("Audio Finished Subscription")
      this.currentlyPlayingCard = undefined;
      this.findSoundCardAndSetIsPlaying(soundCard);
      this.ipcService.sendData("streamdeck:stopplaying", soundCard);
    });

    this.loadData();

    this.ipcService.getStreamDeckStartAudio().subscribe(soundCard => {
      console.log("Stream deck start", soundCard);
      let filteredSoundCards = this.soundcards.filter(sc => sc.runTimeId == soundCard.runTimeId);
      if (filteredSoundCards.length > 0) {
        console.log("Found soundCards", filteredSoundCards);
        this.startPlayingClicked(filteredSoundCards[0]);
      }

    });

    this.ipcService.getStreamDeckStopAudio().subscribe(soundCard => {
      console.log("Stream deck stop", soundCard);
      let filteredSoundCards = this.soundcards.filter(sc => sc.runTimeId == soundCard.runTimeId);
      if (filteredSoundCards.length > 0) {
        this.stopPlayingClicked(filteredSoundCards[0]);
      }
    });
  }

  loadData() {
    // this.soundcards.push(new SoundCard(10,"Wheatley Fool", "E:\\Music\\Portal2Sound\\wheatley-fool.mp3", "Portal", false, false, false, 1));
    // this.soundcards.push(new SoundCard(7,"Cave Johnson lemons", "E:\\Music\\Portal2Sound\\cavejohnson-lemons.mp3", "Portal", false, false, false, 1));
    // this.soundcards.push(new SoundCard(8,"Glados apologize", "E:\\Music\\Portal2Sound\\glados-apologize.mp3", "Portal", false, false, false, 1));
    // this.soundcards.push(new SoundCard(9,"robot position", "E:\\Music\\Portal2Sound\\robot-position.mp3", "Portal", false, false, false, 1));    
    // this.soundcards.push(new SoundCard(1,"4th Horseman", "E:\\Music\\DestinySounds\\4th_horseman.mp3", "Destiny 2", false, false, false, 1));
    // this.soundcards.push(new SoundCard(4,"Black Spindle", "E:\\Music\\DestinySounds\\black_spindle.mp3", "Destiny 2", false, false, false, 1));
    // this.soundcards.push(new SoundCard(2,"Arcite", "E:\\Music\\DestinySounds\\arcite.mp3", "Destiny 2", false, false, false, 1));
    // this.soundcards.push(new SoundCard(3,"Arcite 2", "E:\\Music\\DestinySounds\\arcite2.mp3", "Destiny 2", false, false, false, 1));    
    // this.soundcards.push(new SoundCard(5,"Get your rock off my map", "E:\\Music\\DestinySounds\\get_your_rock_off_my_map.mp3", "Destiny 2", false, false, false, 1));
    // this.soundcards.push(new SoundCard(6,"gjallarhorn", "E:\\Music\\DestinySounds\\gjallarhorn.mp3", "Destiny 2", false, false, false, 1));


    // this.soundcards.sort((soundcard1, soundcard2) => {
    //   if(soundcard1.title > soundcard2.title){
    //     return 1;
    //   } else if(soundcard1.title < soundcard2.title){
    //     return -1;
    //   }
    //   return 0;
    // });    

    // console.log(this.soundcards);

    this.settingsService.getConfig().subscribe(config => {
      let soundcards = config.soundCards;


      soundcards.forEach(soundcard => {
        soundcard.isCurrentlyPlaying = false;
        soundcard.runTimeId = this.runTimeId;
        this.runTimeId++;
      });

      this.sortSoundCards(soundcards);
      this.soundcards = soundcards;
      this.updateConfig();
      this.ipcService.sendData("streamdeck:initwebsocket", null);
    });
  }

  sortSoundCards(soundcards: SoundCard[]) {
    soundcards.sort((soundcard1, soundcard2) => {
      if (soundcard1.title > soundcard2.title) {
        return 1;
      } else if (soundcard1.title < soundcard2.title) {
        return -1;
      }
      return 0;
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

  handelCardsAdded(soundCardsToAdd: SoundCard[]) {
    soundCardsToAdd.forEach(card => {
      card.runTimeId = this.runTimeId;
      this.runTimeId++;
    });
    this.soundcards.push(...soundCardsToAdd);
    this.updateConfig();
    this.sortSoundCards(this.soundcards);
  }


  startPlayingClicked(soundCard: SoundCard) {
    if (undefined !== this.currentlyPlayingCard) {
      this.currentlyPlayingCard.isCurrentlyPlaying = false;
      this.audioService.audioStopPlaying(this.currentlyPlayingCard);
      this.ipcService.sendData("streamdeck:stopplaying", this.currentlyPlayingCard);

    }
    this.currentlyPlayingCard = soundCard;
    this.currentlyPlayingCard.isCurrentlyPlaying = true;
    console.log("Audio start");
    this.audioService.audioStartPlaying(soundCard);
    this.ipcService.sendData("streamdeck:startplaying", this.currentlyPlayingCard);
    this.cd.detectChanges();
  }

  stopPlayingClicked(soundCard: SoundCard) {
    this.currentlyPlayingCard.isCurrentlyPlaying = false;
    this.ipcService.sendData("streamdeck:stopplaying", this.currentlyPlayingCard);
    this.currentlyPlayingCard = undefined;
    console.log("Audio stop");
    this.audioService.audioStopPlaying(soundCard);

    this.cd.detectChanges();
  }

  isFavoriteChanged(soundCard: SoundCard) {
    this.updateConfig();
  }

  showOnStreamDeckChanged(soundCard: SoundCard) {
    this.updateConfig();
    this.updateStreamDeck();
  }

  volumeChanged(soundCard: SoundCard) {
    this.updateConfig();
    if (soundCard.isCurrentlyPlaying) {
      this.audioService.audioVolumeChanged(soundCard.currentVolume);
    }
  }

  handleDeleteSoundCard(soundCard: SoundCard) {
    console.log("Inside handle Delete")
    let indexFoundAt = 0;
   this.soundcards = this.soundcards.filter((sc, index) => {
      if(sc.runTimeId == soundCard.runTimeId){
        if(sc.showOnStreamDeck){
          sc.showOnStreamDeck = false;
          this.showOnStreamDeckChanged(sc);
        }
        if(sc.isCurrentlyPlaying)
          this.stopPlayingClicked(sc);
      }
      return sc.runTimeId != soundCard.runTimeId;
    });

    this.updateConfig();
  }

  handleCardUpdated(updatedCard: SoundCard){
    let runtimeId = updatedCard.runTimeId;
    let foundCards = this.soundcards.filter(card => card.runTimeId == runtimeId);
    if(foundCards.length > 0){
      foundCards[0].title = updatedCard.title;
      foundCards[0].category = updatedCard.category;
      foundCards[0].soundFilePath = updatedCard.soundFilePath;
    }
    this.updateConfig();
    this.updateStreamDeck();
  }


  updateStreamDeck(){
    this.ipcService.sendData("streamdeck:updatecards", null);
  }
  updateConfig() {
    console.log("Updating the config with values:", this.soundcards);
    this.settingsService.updateConfig(this.soundcards);
  }

}

