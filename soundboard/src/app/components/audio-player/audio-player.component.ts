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
  inGameChannelAudioPlayers: Map<String, Map<number, HTMLAudioElement>> = new Map();

  constructor(private ipcService: IpcService, private audioService: AudioService, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.loadAudioDevices();
    this.getAudioVolumeChangedObs();
    this.getAudioStartPlayingObs();
    this.getAudioStopPlayingObs();
    this.getUpdateDeviceIdObs();
    this.getUpdateDeviceIdForInGameChannelObs();
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

  getUpdateDeviceIdForInGameChannelObs(): void {
    this.audioService.getUpdateAudioDeviceIdForInGameChannelSubscription().subscribe(deviceId => {
      this.inGameChannelAudioPlayers.forEach((instanceMap, runtimeId) => {
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

      let inGameAudioPlayerInstancesMap = this.inGameChannelAudioPlayers.get(soundcardRuntimeId);
      if(inGameAudioPlayerInstancesMap) {
        inGameAudioPlayerInstancesMap.forEach((audioPlayer, instanceNumber) => {
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

      let inGameAudioInstancesMap;
      if(soundCard.playOnInGameDevice) {
        inGameAudioInstancesMap = this.inGameChannelAudioPlayers.get(soundCardRuntimeId);
        if(!inGameAudioInstancesMap) {
          inGameAudioInstancesMap = new Map();
          this.inGameChannelAudioPlayers.set(soundCardRuntimeId, inGameAudioInstancesMap);
        }
      }

      let instanceNumber = 0;
      audioInstancesMap.forEach((audioPlayer, playerInstance)=> {
        if(instanceNumber <= playerInstance){
          instanceNumber = playerInstance+1;
        }
      });

      let inGameinstanceNumber = 0;
      if(soundCard.playOnInGameDevice) {
        inGameAudioInstancesMap.forEach((audioPlayer, playerInstance)=> {
          if(inGameinstanceNumber <= playerInstance){
            inGameinstanceNumber = playerInstance+1;
          }
        });
      }

      let audioPlr = this.document.createElement('audio');
      audioPlr.src = soundCard.soundFilePath;
      audioPlr.volume = soundCard.currentVolume;
      (audioPlr as any).setSinkId(this.audioService.currentDeviceId);
      audioInstancesMap.set(instanceNumber, audioPlr);
      audioPlr.addEventListener("ended", () => {
        this.onAudioFinished(soundCard, soundCardRuntimeId, instanceNumber, false);
      })

      if(soundCard.playOnInGameDevice) {
        let inGameAudioPlr = this.document.createElement('audio');
        inGameAudioPlr.src = soundCard.soundFilePath;
        inGameAudioPlr.volume = soundCard.currentVolume;
        (inGameAudioPlr as any).setSinkId(this.audioService.currentDeviceIdForInGameChannel);
        inGameAudioInstancesMap.set(inGameinstanceNumber, inGameAudioPlr);

        inGameAudioPlr.addEventListener("ended", () => {
          this.onAudioFinished(soundCard, soundCardRuntimeId, inGameinstanceNumber, true);
        })
        inGameAudioPlr.play();
      }
      audioPlr.play();      
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

      let inGameAudioInstancesMap = this.inGameChannelAudioPlayers.get(soundcardRuntimeId);
      if(inGameAudioInstancesMap != undefined) {
        inGameAudioInstancesMap.forEach((audioPlayer, instanceNumber) => {
          audioPlayer.pause();
        })
        this.inGameChannelAudioPlayers.delete(soundcardRuntimeId);
      }            
      
    });
  }

  //Tied to onfinished of audio tag
  onAudioFinished(sound: SoundCard, soundcardRuntimeId: string, instanceNumber: number, isInGameAudioPlayer: boolean) {
    let audioPlayers: Map<String, Map<number, HTMLAudioElement>>;
    if(isInGameAudioPlayer) {
      audioPlayers = this.inGameChannelAudioPlayers;
    } else {
      audioPlayers = this.audioPlayers;
    }

    let audioPlayerInstances = audioPlayers.get(soundcardRuntimeId);
    audioPlayerInstances.delete(instanceNumber);
    if(audioPlayerInstances.size == 0) {
      audioPlayers.delete(soundcardRuntimeId);
    }

    let audioInstances = this.audioPlayers.get(soundcardRuntimeId);
    let inGameAudioInstances = this.inGameChannelAudioPlayers.get(soundcardRuntimeId);
    console.log('audioInstances', audioInstances, 'inGameAudioInstances', inGameAudioInstances, 'isInGameAudioPlayer', isInGameAudioPlayer);
    if(audioInstances == undefined && inGameAudioInstances == undefined){
      this.audioService.audioFinished(sound);
    }
  }  
}
