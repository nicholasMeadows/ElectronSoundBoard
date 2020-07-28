import { Injectable } from '@angular/core';
import { IpcRenderer, IpcMain, ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { SoundCard } from '../models/soundcard';

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  private ipc: IpcRenderer;

  constructor() { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
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

  checkIfSoundFileIsvalid(soundFile: string): Observable<boolean>{
    return new Observable(obs => {
      this.ipc.once('file:checkIfFileExistsResponse', (event, result) => {

        obs.next(result);
      });
      this.ipc.send('file:checkIfFileExists', soundFile);
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
}
