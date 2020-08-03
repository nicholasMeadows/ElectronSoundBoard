import { SoundcardService } from './../../services/soundcard.service';
import { AudioService } from './../../services/audio.service';

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

  constructor(public dialog: MatDialog, private soundCardService: SoundcardService, private audioService: AudioService) { }

  ngOnInit(): void {
  }

  soundButtonClicked() {
    this.soundcard.isCurrentlyPlaying = !this.soundcard.isCurrentlyPlaying;
    if (this.soundcard.isCurrentlyPlaying) {
      this.soundCardService.play(this.soundcard);
    } else {
      this.soundCardService.stopPlaying(this.soundcard);
    }
  }

  isFavoriteChange() {
    this.soundCardService.updateConfig();
  }

  showOnStreamDeckChange() {
    this.soundCardService.showOnStreamDeckChanged(this.soundcard);
  }

  volumeChanged() {
    this.soundCardService.volumeChange(this.soundcard);
  }

  handleEditClicked() {
    const dialogRef = this.dialog.open(EditSoundcardComponent, { width: "300px", data: this.soundcard });
    dialogRef.afterClosed().subscribe(editedSoundCard => {
      if (undefined != editedSoundCard) {
        this.soundCardService.editSoundCard(editedSoundCard);
      }
    });
  }

  handleDeleteClicked() {
    const dialogRef = this.dialog.open(DeleteSoundcardDialogComponent, { width: '300px', data: this.soundcard });
    dialogRef.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.soundCardService.deleteSoundCard(this.soundcard);
      }
    })
  }
}