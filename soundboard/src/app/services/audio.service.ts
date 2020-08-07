import { IpcService } from '../services/ipc-service.service';

import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';
import { AudioDevice } from '../models/audiodevice';
import { SoundCard } from '../models/soundcard';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  currentlyPlayingSoundCard: SoundCard;

  audioFinishedSubscription: Subscriber<SoundCard>;
  audioVolumeChangedSubscrition: Subscriber<number>;
  audioStopPlayingSubscription: Subscriber<SoundCard>;
  audioStartPlayingSubscription: Subscriber<SoundCard>;

  constructor(private ipcService: IpcService) {

  }

  //Called in audio component to load available device list
  getAudioOutputDevices(): Observable<AudioDevice[]> {
    let obs: Observable<AudioDevice[]> = new Observable(sub => {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        let devArr: Array<AudioDevice> = [];
        devices.forEach(device => {
          if (device.kind.toLowerCase() === "audiooutput")
            devArr.push(new AudioDevice(device.deviceId, device.label))
        });
        sub.next(devArr);
      });
    });
    return obs;
  }

  //called in main component to update ui when audio is done playing
  getAudioFinishedSubscription(): Observable<SoundCard> {
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
  audioStartPlaying(soundCard: SoundCard) {
    // console.log('Inside audio Start Playing')
    if (undefined != this.currentlyPlayingSoundCard) {
      this.audioStopPlaying(this.currentlyPlayingSoundCard);
    }
    this.currentlyPlayingSoundCard = soundCard;
    this.audioStartPlayingSubscription.next(soundCard);
  }

  //Called from main
  audioStopPlaying(soundCard: SoundCard) {
    this.currentlyPlayingSoundCard.isCurrentlyPlaying = false;
    this.currentlyPlayingSoundCard = undefined;
    this.audioStopPlayingSubscription.next(soundCard);
  }

  //called from audio component
  audioFinished(soundCard: SoundCard) {
    this.currentlyPlayingSoundCard = undefined;
    this.audioFinishedSubscription.next(soundCard);
  }

  // called from ipcService
  audioVolumeChanged(volumeToSet: number) {
    this.audioVolumeChangedSubscrition.next(volumeToSet);
  }

  getSoundDuration(soundFilePath): Observable<number> {
    return new Observable<number>(obs => {
      let audio = new Audio();
      audio.onloadedmetadata = () => {
        obs.next(audio.duration);
        audio.onloadedmetadata = undefined;
        audio.src = undefined;
        audio = undefined;
      }
      audio.src = soundFilePath;
    });
  }
}
