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
  audioPlayers: Map<String, Map<number, HTMLAudioElement>> = new Map();
  secondaryAudioPlayers: Map<String, Map<number, HTMLAudioElement>> = new Map();

  constructor(private ipcService: IpcService, private audioService: AudioService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.loadAudioDevices();
    this.getAudioVolumeChangedObs();
    this.getAudioStartPlayingObs();
    this.getAudioStopPlayingObs();
    this.getUpdateDeviceIdObs();
    this.getUpdateSecondaryAudioDeviceIdObs();
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

  getUpdateSecondaryAudioDeviceIdObs(): void {
    this.audioService.getUpdateSecondaryAudioDeviceIdSubscription().subscribe(deviceId => {
      this.secondaryAudioPlayers.forEach((instanceMap, runtimeId) => {
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

      let secondaryAudioPLayerInstancesMap = this.secondaryAudioPlayers.get(soundcardRuntimeId);
      if(secondaryAudioPLayerInstancesMap) {
        secondaryAudioPLayerInstancesMap.forEach((audioPlayer, instanceNumber) => {
          audioPlayer.volume = soundCard.currentVolume;
        })
      }
    });
  }

  getAudioStartPlayingObs() {
    this.audioService.getAudioStartPlayingSubscription().subscribe(soundCard => {
      if(soundCard.playOnPrimaryAudio) {
        this.startPlayingAudio(soundCard, this.audioPlayers, this.audioService.currentDeviceId);
      }

      if(soundCard.playOnSecondaryAudio) {
        this.startPlayingAudio(soundCard, this.secondaryAudioPlayers, this.audioService.currentSecondaryAudioId);
      }
    });
  }

  startPlayingAudio(soundCard: SoundCard, audioPlayersMap: Map<String, Map<number, HTMLAudioElement>>, audioDeviceId: string) {
    let soundCardRuntimeId = soundCard.runTimeId.toString();
    let audioInstancesMap = audioPlayersMap.get(soundCardRuntimeId);
    if (!audioInstancesMap) {
      audioInstancesMap = new Map();
      audioPlayersMap.set(soundCardRuntimeId, audioInstancesMap);
    }
    let instanceNumber = 0;
    audioInstancesMap.forEach((audioPlayer, playerInstance)=> {
      if(instanceNumber <= playerInstance){
        instanceNumber = playerInstance+1;
      }
    });

    let audioPlr = this.document.createElement('audio');
    audioPlr.src = soundCard.soundFilePath;
    audioPlr.volume = soundCard.currentVolume;
    (audioPlr as any).setSinkId(audioDeviceId);
    audioInstancesMap.set(instanceNumber, audioPlr);
    audioPlr.addEventListener("ended", () => {
      this.onAudioFinished(soundCard, soundCardRuntimeId, instanceNumber, audioPlayersMap);
    })
    audioPlr.play();
  }
  
  getAudioStopPlayingObs() {
    this.audioService.getAudioStopPlayingSubscription().subscribe(soundcard => {
      this.audioStopPlaying(soundcard, this.audioPlayers);
      this.audioStopPlaying(soundcard, this.secondaryAudioPlayers);
    });
  }

  audioStopPlaying(soundcard: SoundCard, audioPlayers: Map<String, Map<number, HTMLAudioElement>>) {
    let soundcardRuntimeId = soundcard.runTimeId.toString();
    let instancesMap = audioPlayers.get(soundcardRuntimeId);
    if(instancesMap != undefined) {
      instancesMap.forEach((audioPlayer, instanceNumber) => {
        audioPlayer.pause();
      });
      audioPlayers.delete(soundcardRuntimeId);
    }           
  }

  //Tied to onfinished of audio tag
  onAudioFinished(sound: SoundCard, soundcardRuntimeId: string, instanceNumber: number, audioPlayers: Map<String, Map<number, HTMLAudioElement>>) {
    let audioPlayerInstances = audioPlayers.get(soundcardRuntimeId);
    audioPlayerInstances.delete(instanceNumber);
    if(audioPlayerInstances.size == 0) {
      audioPlayers.delete(soundcardRuntimeId);
    }

    let audioInstances = this.audioPlayers.get(soundcardRuntimeId);
    let secondaryAudioInstances = this.secondaryAudioPlayers.get(soundcardRuntimeId);
    if(audioInstances == undefined && secondaryAudioInstances == undefined){
      this.audioService.audioFinished(sound);
    }
  }  
}
