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
  soundDuration: string;

  constructor(public dialog: MatDialog, private soundCardService: SoundcardService, private audioService: AudioService) { }

  ngOnInit(): void {
    this.audioService.getSoundDuration(this.soundcard.soundFilePath).subscribe(duration => {
      this.formatDuration(duration);
      // console.log(this.soundcard.soundFilePath, ' Duration: ', leng)
    });
  }

  formatDuration(duration) {
    duration = Math.round(duration);

    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration - (hours * 3600)) / 60);
    let seconds = duration - (hours * 3600) - (minutes * 60);

    let durationStr = "";

    if (hours > 0) {
      if (hours < 10) {
        durationStr += "0" + hours;
      } else {
        durationStr += hours;
      }
      durationStr += ":"
    }

    if (minutes < 10) {
      durationStr += "0" + minutes;
    } else {
      durationStr += minutes;
    }

    durationStr += ":";
    
    if (seconds < 10) {
      durationStr += "0" + seconds;
    } else {
      durationStr += seconds;
    }
    this.soundDuration = durationStr;
  }

  soundButtonClicked(event) {
    event.preventDefault();
    this.soundcard.isCurrentlyPlaying = !this.soundcard.isCurrentlyPlaying;
    if (this.soundcard.isCurrentlyPlaying) {
      this.soundCardService.play(this.soundcard);
    } else {
      this.soundCardService.stopPlaying(this.soundcard);
    }
  }

  isFavoriteChange(event) {
    event.preventDefault();
    this.soundCardService.updateConfig();
  }

  showOnStreamDeckChange(event) {
    event.preventDefault();
    this.soundCardService.showOnStreamDeckChanged(this.soundcard);
  }

  volumeChanged(event) {
    event.preventDefault();
    this.soundCardService.volumeChange(this.soundcard);
  }

  handleEditClicked(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(EditSoundcardComponent, { width: "300px", data: this.soundcard });
    dialogRef.afterClosed().subscribe(editedSoundCard => {
      if (undefined != editedSoundCard) {
        this.soundCardService.editSoundCard(editedSoundCard);
      }
    });
  }

  handleDeleteClicked(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DeleteSoundcardDialogComponent, { width: '300px', data: this.soundcard });
    dialogRef.afterClosed().subscribe(shouldDelete => {
      if (shouldDelete) {
        this.soundCardService.deleteSoundCard(this.soundcard);
      }
    })
  }
}