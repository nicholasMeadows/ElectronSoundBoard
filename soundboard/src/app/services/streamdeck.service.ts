import { SoundCard } from './../models/soundcard';
import { Observable } from 'rxjs';
import { IpcService } from './ipc-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreamdeckService {
  
  constructor(private ipcService: IpcService) { }

  initStreamDeckWebSocket(){
    console.log("Inside init stream deck web socket")
    this.ipcService.sendData("streamdeck:initwebsocket", null);
  }

  getStreamDeckStartAudioSubscription():Observable<SoundCard> {
    return new Observable<SoundCard>(obs => {
      this.ipcService.getStreamDeckStartAudio().subscribe(soundCard => {
        obs.next(soundCard);
      });
    });    
  }

  getStreamDeckStopAudioSubscription(): Observable<SoundCard> {
    return new Observable<SoundCard> (obs => {
      this.ipcService.getStreamDeckStopAudio().subscribe(soundCard => {
        obs.next(soundCard);
      })
    });
  }

  getStreamDeckStopAllAudioSubscription(): Observable<void> {
    return new Observable<void> (obs => {
      this.ipcService.getStreamDeckStopAllAudio().subscribe(() => {
        obs.next();
      })
    })
  }

  getPlayRandomHypeSongOrStopIfAlreadyPlayingSubscription(): Observable<void> {
    return new Observable<void> (obs => {
      this.ipcService.getPlayRandomHypeSongOrStopIfAlreadyPlaying().subscribe(() => {
        obs.next();
      })
    });
  }

  getPlayRandomFromSpecifiedCategory(): Observable<string> {
    return new Observable<string> (obs => {
      this.ipcService.getPlayRandomFromSpecifiedCategory().subscribe((category) => {
        obs.next(category);
      })
    })
  }

  getPlaySpecificSoundFromSpecifiedCategory(): Observable<{category: string, sound: string}> {
    return new Observable(obs => {
      this.ipcService.getPlaySpecificSoundFromSpecifiedCtegory().subscribe(categorySoundObj => {
        obs.next(categorySoundObj);
      })
    })
  }
  sendStopPlayingToStreamDeck(soundCard) {
    this.ipcService.sendData("streamdeck:stopplaying", soundCard);
  }

  sendPlayAudioToStreamDeck(soundcard){
    this.ipcService.sendData("streamdeck:startplaying", soundcard);
  }

  sendStopAudioToStreamDeck(soundcard) {
    this.ipcService.sendData("streamdeck:stopplaying", soundcard);
  }

  sendUpdateCardsToStreamDeck(){
    this.ipcService.sendData("streamdeck:updatecards", null);
  }
}
