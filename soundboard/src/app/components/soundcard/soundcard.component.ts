import { SoundCard } from './../../models/soundcard';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-soundcard',
  templateUrl: './soundcard.component.html',
  styleUrls: ['./soundcard.component.css']
})
export class SoundcardComponent implements OnInit {

  @Input()
  soundcard: SoundCard;

  @Output()
  startPlayingClicked: EventEmitter<SoundCard> = new EventEmitter<SoundCard>();

  @Output()
  stopPlayingClicked: EventEmitter<SoundCard> = new EventEmitter<SoundCard>();

  @Output()
  volumeChanges: EventEmitter<SoundCard> = new EventEmitter<SoundCard>();

  @Output()
  isFavoriteChangeEvent: EventEmitter<SoundCard> = new EventEmitter<SoundCard>();

  @Output()
  showOnStreamDeckChangeEvent: EventEmitter<SoundCard> = new EventEmitter<SoundCard>();

  constructor() { }

  ngOnInit(): void {
  }

  soundButtonClicked() {
    this.soundcard.isCurrentlyPlaying = !this.soundcard.isCurrentlyPlaying;
    if (this.soundcard.isCurrentlyPlaying) {
      this.startPlayingClicked.emit(this.soundcard);
    } else {
      this.stopPlayingClicked.emit(this.soundcard);
    }
  }

  isFavoriteChange() {
    this.isFavoriteChangeEvent.emit(this.soundcard);
  }

  showOnStreamDeckChange() {
    this.showOnStreamDeckChangeEvent.emit(this.soundcard);
  }


  volumeChanged() {
    this.volumeChanges.emit(this.soundcard);
  }
}