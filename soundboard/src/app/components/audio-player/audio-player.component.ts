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
  // currentSound: SoundCard;
  currentSounds: SoundCard[] = [];

  // @ViewChild("audioPlayer")
  // audioPlayer;
  audioPlayers: HTMLAudioElement[] = [];

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
      this.audioPlayers.forEach(player => {
        (player as any).setInkId(deviceId);
      });
    });
  }

  loadAudioDevices() {
    this.audioService.getAudioOutputDevices().subscribe(deviceArray => {
      this.ipcService.sendData("audiodevice:audiodevicelist", deviceArray);
    });
  }

  getAudioVolumeChangedObs(){
    this.audioService.getAudioVolumeSubscription().subscribe(soundCard => {
      let audioPlayer = this.audioPlayers.find(plr => {
        plr.id === soundCard.runTimeId.toString();
      });
      if(audioPlayer) {
        audioPlayer.volume = soundCard.currentVolume;
      }
      // this.audioPlayer.nativeElement.volume = volume;
    });
  }

  getAudioStartPlayingObs(){
    this.audioService.getAudioStartPlayingSubscription().subscribe(soundCard => {
      // this.currentSound = soundCard;
      // this.audioPlayer.nativeElement.src = this.currentSound.soundFilePath;
      // this.audioPlayer.nativeElement.volume = this.currentSound.currentVolume;
      // this.audioPlayer.nativeElement.play();
      // this.audioPlayer.nativeElement.addEventListener("ended", () => {
      //   this.onAudioFinished();
      // })     

      this.currentSounds.push(soundCard);
      let audioPlr = this.document.createElement('audio');
      
      audioPlr.id = soundCard.runTimeId.toString();
      audioPlr.src = soundCard.soundFilePath;
      audioPlr.volume = soundCard.currentVolume;
      (audioPlr as any).setSinkId(this.audioService.currentDeviceId);
      
      audioPlr.play();
      this.audioPlayers.push(audioPlr);
      
      audioPlr.addEventListener("ended", () => {
        this.onAudioFinished(audioPlr);
      })     
    });
  }

  getAudioStopPlayingObs(){
    this.audioService.getAudioStopPlayingSubscription().subscribe(soundcard => {
      // this.audioPlayer.nativeElement.pause();

      let playerIndex = this.audioPlayers.findIndex(player => {
        return player.id === soundcard.runTimeId.toString();
      });

      this.audioPlayers[playerIndex].pause();
      this.audioPlayers.splice(playerIndex, 1);
    });
  }

  //Tied to onfinished of audio tag
  onAudioFinished(audioPlr: HTMLAudioElement){
    let soundIndex = this.currentSounds.findIndex(sound => {
      return audioPlr.id === sound.runTimeId.toString();
    });
    let playerIndex = this.audioPlayers.findIndex(plr => {
      return audioPlr.id === plr.id;
    });

    let sound = this.currentSounds[soundIndex]
    this.audioService.audioFinished(sound);

    this.currentSounds.splice(soundIndex, 1);
    this.audioPlayers.splice(playerIndex, 1);

  }
}
