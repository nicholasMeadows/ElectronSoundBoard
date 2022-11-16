import { SoundCard } from './../models/soundcard';
import { IpcService } from '../services/ipc-service.service';

import { Observable, Subscriber } from 'rxjs';
import { Injectable } from '@angular/core';
import { AudioDevice } from '../models/audiodevice';


@Injectable({
  providedIn: 'root'
})
export class AudioService {
  currentDeviceId: string;
  currentDeviceIdForInGameChannel: string;

  audioFinishedSubscription: Subscriber<SoundCard>;
  audioVolumeChangedSubscrition: Subscriber<SoundCard>;
  audioStopPlayingSubscription: Subscriber<SoundCard>;
  audioStartPlayingSubscription: Subscriber<SoundCard>;
  updateAudioDeviceIdSubscription: Subscriber<string>;
  updateAudioDeviceIdForInGameChannel: Subscriber<string>;


  // constructor() {
    
  // }

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
  getAudioVolumeSubscription(): Observable<SoundCard> {
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

  getUpdateAudioDeviceIdSubscription(): Observable<string> {
    return new Observable(obs => {
      this.updateAudioDeviceIdSubscription = obs;
    });
  }

  getUpdateAudioDeviceIdForInGameChannelSubscription(): Observable<string> {
    return new Observable(obs => {
      this.updateAudioDeviceIdForInGameChannel = obs;
    })
  }

  //Called from main
  audioStartPlaying(soundCard: SoundCard) {
    this.audioStartPlayingSubscription.next(soundCard);
  }

  //Called from main
  audioStopPlaying(soundCard: SoundCard) {
    this.audioStopPlayingSubscription.next(soundCard);
  }

  //called from audio component
  audioFinished(soundCard: SoundCard) {
    this.audioFinishedSubscription.next(soundCard);
  }

  // called from ipcService
  audioVolumeChanged(soundCard: SoundCard) {
    this.audioVolumeChangedSubscrition.next(soundCard);
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

  updateCurrentDeviceId(deviceId: string) {
    this.currentDeviceId = deviceId;
    this.updateAudioDeviceIdSubscription.next(this.currentDeviceId);
  }

  updateCurrentInGameChannelDeviceId(deviceId: string) {
    this.currentDeviceIdForInGameChannel = deviceId;
    this.updateAudioDeviceIdForInGameChannel.next(this.currentDeviceIdForInGameChannel);
  }
}
