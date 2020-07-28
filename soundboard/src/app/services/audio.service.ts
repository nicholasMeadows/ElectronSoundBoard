import { IpcService } from '../services/ipc-service.service';

import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';
import { AudioDevice } from '../models/audiodevice';
import { SoundCard } from '../models/soundcard';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioFinishedSubscription: Subscriber<SoundCard>;
  audioVolumeChangedSubscrition: Subscriber<number>;
  audioStopPlayingSubscription: Subscriber<SoundCard>;
  audioStartPlayingSubscription: Subscriber<SoundCard>;

  constructor(private ipcService: IpcService) { 

  }

  //Called in audio component to load available device list
  getAudioOutputDevices(): Observable<AudioDevice[]>{
    let obs:Observable<AudioDevice[]> = new Observable(sub => {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        let devArr:Array<AudioDevice> = [];
        devices.forEach(device => {
          if(device.kind.toLowerCase() === "audiooutput")
            devArr.push(new AudioDevice(device.deviceId, device.label))
        });
       sub.next(devArr);
      });
    });    
    return obs;
  }
  
  //called in main component to update ui when audio is done playing
  getAudioFinishedSubscription():Observable<SoundCard>{
    return new Observable(obs => {
      this.audioFinishedSubscription = obs;
    });
  }

  //called in audio component to update volume
  getAudioVolumeSubscription(): Observable<number> {
    return new Observable(obs => {
      this.audioVolumeChangedSubscrition = obs;
    })  
  }

  //called in audio component to watch for stop request from main compoonet
  getAudioStopPlayingSubscription(): Observable<SoundCard> {
    return new Observable(obs => {
      this.audioStopPlayingSubscription = obs;
    });
  }

  // called in audio component to watch for play request from main component
  getAudioStartPlayingSubscription(): Observable<SoundCard> {
    return new Observable(obs => {
      this.audioStartPlayingSubscription = obs;
    });
  }

  //Called from main
  audioStartPlaying(soundCard: SoundCard){
    this.audioStartPlayingSubscription.next(soundCard);
  }

  //Called from main
  audioStopPlaying(soundCard: SoundCard){
    this.audioStopPlayingSubscription.next(soundCard);
  }

  //called from audio component
  audioFinished(soundCard: SoundCard){
    this.audioFinishedSubscription.next(soundCard);
  }

  // called from ipcService
  audioVolumeChanged(volumeToSet: number){
    this.audioVolumeChangedSubscrition.next(volumeToSet);
  }
}
