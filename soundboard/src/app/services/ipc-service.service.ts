import { Injectable } from '@angular/core';
import { IpcRenderer, IpcMain, ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { SoundCard } from '../models/soundcard';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private ipc: IpcRenderer;

  constructor(audioService: AudioService) { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
        this.ipc.on('audiodevice:updatecurrentdevice', (event, deviceId) => {
          // obs.next(soundCard);
          audioService.updateCurrentDeviceId(deviceId);
        });
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }    
  }

  loadConfig():Observable<any>{
    return new Observable<any>(obs => {
      this.ipc.once('config:loadConfigResponse', (event, config) =>{
        obs.next(config);
      });

      this.ipc.send('config:loadConfig');
    });
  }

  sendData(channel: string, payload){
    this.ipc.send(channel, payload);
  }

  getData() {
    return new Observable<any>(observer => {
      this.ipc.once('getDataResponse', (event, arg) => {
        observer.next(arg);
      });

      this.ipc.send('getData');
    });
  }

  getStreamDeckStartAudio():Observable<SoundCard> {
    return new Observable(obs => {
      this.ipc.on("streamdeckstartaudio", (event, soundCard) => {
        obs.next(soundCard);
      });
    })
  }

  getStreamDeckStopAudio():Observable<SoundCard> {
    return new Observable(obs => {
      this.ipc.on("streamdeckstopaudio", (event, soundCard) => {
        obs.next(soundCard);
      });
    })
  }

  getPlayRandomOrStopIfAlreadyPlaying(): Observable<void> {
    return new Observable(obs => {
      this.ipc.on("playRandomOrStopIfAlreadyPlaying", (event, data) => {
        obs.next();
      });
    })
  }
  getPlayRandomHypeSongOrStopIfAlreadyPlaying(): Observable<void> {
    return new Observable(obs => {
      this.ipc.on("playRandomHypeSongOrStopIfAlreadyPlaying", (event, data) => {
        obs.next();
      });
    })
  }
    
  getPlayAllAudio(): Observable<void> {
    return new Observable(obs => {
      this.ipc.on("playAllClicked", (event) => {
        obs.next();
      });
    });
  }

  getPlayRandom(): Observable<void> {
    return new Observable(obs => {
      this.ipc.on("playRandomClicked", (event) => {
        obs.next();
      });
    });
  }

  getPlay10Random(): Observable<void> {
    return new Observable(obs => {
      this.ipc.on("play10RandomClicked", (event) => {
        obs.next();
      });
    });
  }

  getPlayEarRape(): Observable<void> {
    return new Observable(obs => {
      this.ipc.on("playEarRapeClicked", (event) => {
        obs.next();
      });
    });
  }
}
