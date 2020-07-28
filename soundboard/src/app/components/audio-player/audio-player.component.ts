import { SoundCard } from './../../models/soundcard';
import { AudioService } from './../../services/audio.service';
import { IpcService } from './../../../../SoundBoard-win32-x64/resources/app/src/app/services/ipc-service.service';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {
  currentSound: SoundCard;

  @ViewChild("audioPlayer")
  audioPlayer//: ElementRef<HTMLAudioElement>;

  constructor(private ipcService: IpcService, private audioService: AudioService, @Inject(DOCUMENT) private document: Document) { 
  }

  ngOnInit(): void {
    this.loadAudioDevices();
    this.getAudioVolumeChangedObs();
    this.getAudioStartPlayingObs();
    this.getAudioStopPlayingObs();
    
  }

  loadAudioDevices() {
    this.audioService.getAudioOutputDevices().subscribe(deviceArray => {
      this.ipcService.sendData("audiodevice:audiodevicelist", deviceArray);
    });
  }

  getAudioVolumeChangedObs(){
    this.audioService.getAudioVolumeSubscription().subscribe(volume => {
      this.audioPlayer.nativeElement.volume = volume;
    });
  }

  getAudioStartPlayingObs(){
    this.audioService.getAudioStartPlayingSubscription().subscribe(soundCard => {
      this.currentSound = soundCard;
      this.audioPlayer.nativeElement.src = this.currentSound.soundFilePath;
      this.audioPlayer.nativeElement.volume = this.currentSound.currentVolume;
      this.audioPlayer.nativeElement.play();
      this.audioPlayer.nativeElement.addEventListener("ended", () => {
        this.onAudioFinished();
      })     
    });
  }

  getAudioStopPlayingObs(){
    this.audioService.getAudioStopPlayingSubscription().subscribe(soundcard => {
      this.audioPlayer.nativeElement.pause();
    });
  }

  //Tied to onfinished of audio tag
  onAudioFinished(){
    this.audioService.audioFinished(this.currentSound);
  }
}
