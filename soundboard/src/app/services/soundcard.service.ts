import { StreamdeckService } from './streamdeck.service';
import { AudioService } from './audio.service';

import { IpcService } from './ipc-service.service';
import { SettingsService } from './settings.service';
import { SoundCard } from './../models/soundcard';
import { Observable } from 'rxjs';
import { Injectable, ChangeDetectorRef, ApplicationRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundcardService {
  private runTimeId: number = 0;
  soundcards: SoundCard[] = [];

  constructor(private settingsService: SettingsService, private ipcService: IpcService, private audioService: AudioService, private streamDeckService: StreamdeckService, private appRef: ApplicationRef) {
    this.streamDeckService.getStreamDeckStartAudioSubscription().subscribe(soundCard => {
      console.log("Stream deck start", soundCard);
      let filteredSoundCards = this.soundcards.filter(sc => sc.runTimeId == soundCard.runTimeId);
      if (filteredSoundCards.length > 0) {
        let foundSoundCard = filteredSoundCards[0];
        console.log("Found soundCards", filteredSoundCards);
        foundSoundCard.isCurrentlyPlaying = true;
        this.appRef.tick();
        this.play(foundSoundCard);
      }
    });

    this.streamDeckService.getStreamDeckStopAudioSubscription().subscribe(soundCard => {
      console.log("Stream deck stop", soundCard);
      let filteredSoundCards = this.soundcards.filter(sc => sc.runTimeId == soundCard.runTimeId);
      if (filteredSoundCards.length > 0) {
        let foundSoundCard = filteredSoundCards[0];
        foundSoundCard.isCurrentlyPlaying = false;
        this.appRef.tick();
        this.stopPlaying(foundSoundCard);
      }
    });

    this.audioService.getAudioFinishedSubscription().subscribe(soundCard => {
      soundCard.isCurrentlyPlaying = false;
      this.streamDeckService.sendStopPlayingToStreamDeck(soundCard);
    });


    
    this.settingsService.getConfig().subscribe(config => {
      let soundcards = config.soundCards;
      soundcards.forEach(soundcard => {
        soundcard.isCurrentlyPlaying = false;
        soundcard.runTimeId = this.runTimeId;
        this.runTimeId++;
      });

      this.sortSoundCards(soundcards);
      this.soundcards.push(...soundcards);
      this.updateConfig();
      this.streamDeckService.initStreamDeckWebSocket();
    });
  }

  loadSoundCards(): Observable<SoundCard[]> {
    return new Observable(obs => {
      obs.next(this.soundcards);
    });
  }

  play(soundcard: SoundCard) {
    this.audioService.audioStartPlaying(soundcard);
    this.streamDeckService.sendPlayAudioToStreamDeck(soundcard);

  }

  stopPlaying(soundcard: SoundCard) {
    this.audioService.audioStopPlaying(soundcard);
    this.streamDeckService.sendStopAudioToStreamDeck(soundcard);
  }

  volumeChange(soundCard: SoundCard) {
    console.log("Volume Changed called")
    this.updateConfig();
    if (soundCard.isCurrentlyPlaying) {
      this.audioService.audioVolumeChanged(soundCard.currentVolume);
    }
  }

  addNewCards(soundCards: SoundCard[]) {
    soundCards.forEach(card => {
      card.runTimeId = this.runTimeId;
      this.runTimeId++;
    });
    this.soundcards.push(...soundCards);
    this.updateConfig();
    this.sortSoundCards(this.soundcards);
  }

  editSoundCard(editedSoundCard: SoundCard) {
    let runtimeId = editedSoundCard.runTimeId;
    let foundCards = this.soundcards.filter(card => card.runTimeId == runtimeId);
    if (foundCards.length > 0) {
      foundCards[0].title = editedSoundCard.title;
      foundCards[0].category = editedSoundCard.category;
      foundCards[0].soundFilePath = editedSoundCard.soundFilePath;
    }
    this.updateConfig();
    this.updateStreamDeck();
  }

  deleteSoundCard(soundCard: SoundCard) {
    console.log("Inside handle Delete")
    let indexFoundAt = 0;

    for (let [index, card] of this.soundcards.entries()) {
      if (card.runTimeId == soundCard.runTimeId) {
        indexFoundAt = index;
        if (card.showOnStreamDeck) {
          card.showOnStreamDeck = false;
          this.showOnStreamDeckChanged(card);
        }
        if (card.isCurrentlyPlaying) {
          this.stopPlaying(card);
        }
      }
    }

    this.soundcards.splice(indexFoundAt, 1);
    this.updateConfig();
  }

  showOnStreamDeckChanged(soundcard: SoundCard) {
    this.updateConfig();
    this.updateStreamDeck();
  }

  getSoundCards(): SoundCard[] {
    return this.soundcards;
  }

  private updateStreamDeck() {
    this.streamDeckService.sendUpdateCardsToStreamDeck();
  }

  private sortSoundCards(soundcards: SoundCard[]) {
    soundcards.sort((soundcard1, soundcard2) => {
      if (soundcard1.title > soundcard2.title) {
        return 1;
      } else if (soundcard1.title < soundcard2.title) {
        return -1;
      }
      return 0;
    });
  }

  updateConfig() {
    console.log("Updating the config with values:", this.soundcards);
    this.settingsService.updateConfig(this.soundcards);
  }
}
