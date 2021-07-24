
import { AudioService } from './../../services/audio.service';
import { Component, OnInit } from '@angular/core';
import { SoundcardService } from 'src/app/services/soundcard.service';

@Component({
  selector: 'app-stop-all-sounds',
  templateUrl: './stop-all-sounds.component.html',
  styleUrls: ['./stop-all-sounds.component.css']
})
export class StopAllSoundsComponent implements OnInit {

  constructor(private soundCardService: SoundcardService) { }

  ngOnInit(): void {
  }

  clicked(){
    this.soundCardService.stopPlayingAll();
  }
}
