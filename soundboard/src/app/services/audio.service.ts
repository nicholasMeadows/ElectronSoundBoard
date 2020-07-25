import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AudioDevice } from '../models/audiodevice';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

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
}
