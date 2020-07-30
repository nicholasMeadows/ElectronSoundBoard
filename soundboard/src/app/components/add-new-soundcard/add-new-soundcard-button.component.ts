import { IpcService } from './../../services/ipc-service.service';
import { SoundCard } from './../../models/soundcard';
import { AddNewSoundcardDialogComponent } from './../add-new-soundcard-dialog/add-new-soundcard-dialog.component';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-soundcard-button',
  templateUrl: './add-new-soundcard-button.component.html',
  styleUrls: ['./add-new-soundcard-button.component.css']
})
export class AddNewSoundcardButtonComponent implements OnInit {
  soundCardsToAdd: SoundCard[];
  // animal: string; 

  constructor(public dialog: MatDialog, private ipcService: IpcService) { }

  @Output()
  cardsAdded: EventEmitter<SoundCard[]> = new EventEmitter();

  ngOnInit(): void {
  }

  openDialog(){
    this.soundCardsToAdd = [new SoundCard(undefined, "","","", false, false, false, 1)];
    const dialogRef = this.dialog.open(AddNewSoundcardDialogComponent, {width: '300px', data: this.soundCardsToAdd});
    dialogRef.afterClosed().subscribe(cardsToAdd => {
      if(undefined == cardsToAdd){
      console.log('Dialog was closed with no results')
      } else {
        this.cardsAdded.emit(cardsToAdd);
      }
    })
  }
}