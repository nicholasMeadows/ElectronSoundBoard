import { SoundCard } from './../../models/soundcard';
import { AudioService } from './../../services/audio.service';
import { IpcService } from '../../services/ipc-service.service';
import { Component, OnInit, ViewChild, ElementRef, Inject, PlatformRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
  audioPlayers: Map<String, Map<Number, HTMLAudioElement>> = new Map();
  currentDeviceId: string;

  constructor(private ipcService: IpcService, private audioService: AudioService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.loadAudioDevices();
    this.getAudioVolumeChangedObs();
    this.getAudioStartPlayingObs();
    this.getAudioStopPlayingObs();
    this.getUpdateDeviceIdObs();
  }

  getUpdateDeviceIdObs(): void {
    this.audioService.getUpdateAudioDeviceIdSubscription().subscribe(deviceId => {
      this.audioPlayers.forEach((instancesMap, soundcardRuntimId) => {
        instancesMap.forEach((audioPlayer, instancenumber) => {
          (audioPlayer as any).setInkId(deviceId);
        })
      });
    });



    this.audioService.getUpdateAudioDeviceIdSubscription().subscribe(deviceId => {
      this.audioPlayers.forEach((instanceMap, runtimeId) => {
        instanceMap.forEach((audioPlayer, instanceNumber) => {
          (audioPlayer as any).setInkId(deviceId);  
        })
      });
    });
  }

  loadAudioDevices() {
    this.audioService.getAudioOutputDevices().subscribe(deviceArray => {
      this.ipcService.sendData("audiodevice:audiodevicelist", deviceArray);
    });
  }

  getAudioVolumeChangedObs() {
    this.audioService.getAudioVolumeSubscription().subscribe(soundCard => {
      let soundcardRuntimeId = soundCard.runTimeId.toString();
      let audioPlayerInstancesMap = this.audioPlayers.get(soundcardRuntimeId);
      if (audioPlayerInstancesMap) {
        audioPlayerInstancesMap.forEach((audioPlayer, instanceNumber) => {
          audioPlayer.volume = soundCard.currentVolume;
        })
      }
    });
  }

  getAudioStartPlayingObs() {
    this.audioService.getAudioStartPlayingSubscription().subscribe(soundCard => {
      let soundCardRuntimeId = soundCard.runTimeId.toString();
      let audioInstancesMap = this.audioPlayers.get(soundCardRuntimeId);
      if (!audioInstancesMap) {
        audioInstancesMap = new Map();
        this.audioPlayers.set(soundCardRuntimeId, audioInstancesMap);
      }
      let instanceNumber = audioInstancesMap.size;

      let audioPlr = this.document.createElement('audio');
      audioPlr.src = soundCard.soundFilePath;
      audioPlr.volume = soundCard.currentVolume;
      (audioPlr as any).setSinkId(this.audioService.currentDeviceId);
      audioPlr.play();
      audioInstancesMap.set(instanceNumber, audioPlr);

      audioPlr.addEventListener("ended", () => {
        this.onAudioFinished(soundCard, soundCardRuntimeId, instanceNumber);
      })
    });
  }

  getAudioStopPlayingObs() {
    this.audioService.getAudioStopPlayingSubscription().subscribe(soundcard => {
      let soundcardRuntimeId = soundcard.runTimeId.toString();
      let instancesMap = this.audioPlayers.get(soundcardRuntimeId);
      instancesMap.forEach((audioPlayer, instanceNumber) => {
        audioPlayer.pause();
      });
      this.audioPlayers.delete(soundcardRuntimeId);
    });
  }

  //Tied to onfinished of audio tag
  onAudioFinished(sound: SoundCard, soundcardRuntimeId: string, instanceNumber: number) {
    let audioPlayersInstances = this.audioPlayers.get(soundcardRuntimeId);
    audioPlayersInstances.delete(instanceNumber);
    if (audioPlayersInstances.size == 0) {
      this.audioPlayers.delete(soundcardRuntimeId);
      this.audioService.audioFinished(sound);
    }
  }
}
