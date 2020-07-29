import { SoundCard } from './../../models/soundcard';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-soundcard-dialog',
  templateUrl: './delete-soundcard-dialog.component.html',
  styleUrls: ['./delete-soundcard-dialog.component.css']
})
export class DeleteSoundcardDialogComponent implements OnInit {



  soundCard: SoundCard;
  constructor(private dialogRef: MatDialogRef<DeleteSoundcardDialogComponent>, @Inject(MAT_DIALOG_DATA) private soundCardInput: SoundCard) { 
    this.soundCard = soundCardInput;
  }

  ngOnInit(): void {
  }

  yesClicked(){
    this.dialogRef.close(true);
  }
  noClicked(){
    this.dialogRef.close(false);
  }
}
