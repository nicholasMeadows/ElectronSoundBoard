import { EditSoundcardComponent } from './../edit-soundcard/edit-soundcard.component';
import { DeleteSoundcardDialogComponent } from './../delete-soundcard-dialog/delete-soundcard-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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

  @Output()
  deleteSoundCard: EventEmitter<SoundCard> = new EventEmitter();

  @Output()
  editSoundCard: EventEmitter<SoundCard> = new EventEmitter();

  constructor(public dialog: MatDialog) { }

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

  handleEditClicked(){
    const dialogRef = this.dialog.open(EditSoundcardComponent, {width: "300px", data: this.soundcard});
    dialogRef.afterClosed().subscribe(editedSoundCard => {
      if(undefined != editedSoundCard){
        this.editSoundCard.emit(editedSoundCard);
      }
    });
  }
  handleDeleteClicked(){
    const dialogRef = this.dialog.open(DeleteSoundcardDialogComponent, {width: '300px', data:this.soundcard});
    dialogRef.afterClosed().subscribe(shouldDelete => {
      if(shouldDelete){
        this.deleteSoundCard.emit(this.soundcard);
      }
    })
  }
}