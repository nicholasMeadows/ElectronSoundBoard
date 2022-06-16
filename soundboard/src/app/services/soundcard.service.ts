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

    this.ipcService.getPlayAllAudio().subscribe(() => {
      this.soundcards.forEach(sound => {
        sound.isCurrentlyPlaying = true;
        this.play(sound);
      })
    })

    this.ipcService.getPlayRandom().subscribe(() => {
      let randomIndex = this.getRandomNumber(0, this.soundcards.length-1);
      let soundCard = this.soundcards[randomIndex];
      soundCard.isCurrentlyPlaying = true;
      this.play(soundCard);
    });

    this.ipcService.getPlay10Random().subscribe(() => {
      let randomIndexes = [];
      let max = this.soundcards.length -1;
      for(let i=0; i < 10; ++i){
        randomIndexes.push(this.getRandomNumber(0,max));
      }

      randomIndexes.forEach(index => {
        let soundCard = this.soundcards[index];
        soundCard.isCurrentlyPlaying = true;
        this.play(soundCard);
      })
    });

    this.ipcService.getPlayEarRape().subscribe(()=> {
      let earRapeSounds = this.soundcards.filter(sound => {
        return sound.category === "EarRape";
      });

      earRapeSounds.forEach(sound => {
        sound.isCurrentlyPlaying = true;
        this.play(sound);
      })
    });
  }

  private getRandomNumber(min: number, max: number): number{
    return Math.floor((Math.random() * (max - min) + min));
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
    console.log("Stop Playing called");
    this.audioService.audioStopPlaying(soundcard);
    this.streamDeckService.sendStopAudioToStreamDeck(soundcard);
    soundcard.isCurrentlyPlaying = false;
  }

  stopPlayingAll(){
    this.soundcards.forEach(card => {
      if(card.isCurrentlyPlaying){
        this.stopPlaying(card);
      }
    });
  }

  volumeChange(soundCard: SoundCard) {
    console.log("Volume Changed called")
    this.updateConfig();
    if (soundCard.isCurrentlyPlaying) {
      this.audioService.audioVolumeChanged(soundCard);
    }
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
