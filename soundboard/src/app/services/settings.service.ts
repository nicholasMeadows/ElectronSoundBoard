import { Observable } from 'rxjs';
import { SoundCard } from './../models/soundcard';
import { IpcService } from './ipc-service.service';
import { Injectable } from '@angular/core';
import { Config } from '../models/config';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  


  constructor(private ipcService: IpcService) { }

  getConfig(): Observable<Config> {
    return new Observable(obs => {
      this.ipcService.loadConfig().subscribe(config => {
        obs.next(config);
      });
    });
  }

  updateConfig(soundcards: SoundCard[]) {
    this.ipcService.sendData("config:updateConfig", soundcards);
  }
}
