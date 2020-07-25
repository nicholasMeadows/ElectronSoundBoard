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

  getAudioFinishedSubscription(): Observable<SoundCard>{
    return new Observable<SoundCard>((obs) => {
      this.ipc.on("audio:audiofinishedTest", (event, soundCard) => {
        obs.next(soundCard);
      })
    })
  }
}
