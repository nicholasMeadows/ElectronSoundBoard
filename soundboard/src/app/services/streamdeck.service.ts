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

  getPlayRandomOrStopIfAlreadyPlayingSubscription(): Observable<void> {
    return new Observable<void> (obs => {
      this.ipcService.getPlayRandomOrStopIfAlreadyPlaying().subscribe(() => {
        obs.next();
      })
    });
  }

  getPlayRandomHypeSongOrStopIfAlreadyPlayingSubscription(): Observable<void> {
    return new Observable<void> (obs => {
      this.ipcService.getPlayRandomHypeSongOrStopIfAlreadyPlaying().subscribe(() => {
        obs.next();
      })
    });
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
