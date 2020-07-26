import { IpcService } from './../../services/ipc-service.service';
import { SoundCardWithValidationData } from './../../models/soundCardWithValidationData';
import { SoundCard } from './../../models/soundcard';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-new-soundcard-dialog',
  templateUrl: './add-new-soundcard-dialog.component.html',
  styleUrls: ['./add-new-soundcard-dialog.component.css']
})
export class AddNewSoundcardDialogComponent implements OnInit {
  soundCardWithValidationArr: Array<SoundCardWithValidationData>;
  // testArr: String[]=['test 1', 'test2'];

  constructor(private dialogRef: MatDialogRef<AddNewSoundcardDialogComponent>, @Inject(MAT_DIALOG_DATA) private soundCardInput: Array<SoundCard>, private ipcService: IpcService, private cd: ChangeDetectorRef) {
    this.soundCardWithValidationArr = soundCardInput.map(soundcard => new SoundCardWithValidationData(soundcard, false, "", false, "", false, ""));
  }

  ngOnInit(): void {
  }

  validateTitleField(soundCard: SoundCardWithValidationData) {


    if (soundCard.title != "") {
      soundCard.isTitleValid = true;
      soundCard.titleInvalidMessage = "";
      return true;
    }

    soundCard.isTitleValid = false;
    soundCard.titleInvalidMessage = "Field Required";
    return false;
  }

  validateCategoryField(soundCard: SoundCardWithValidationData) {
    if (soundCard.category != "") {
      soundCard.isCategoryValid = true;
      soundCard.categoryInvalidMessage = ""
      return true;
    }
    soundCard.isCategoryValid = false;
    soundCard.categoryInvalidMessage = "Field Required";
    return false;
  }

  isSoundFildFieldEmpty(soundCard: SoundCardWithValidationData) {
    if (soundCard.soundFilePath != "") {
      if(soundCard.soundFilePath.endsWith('.mp3') || soundCard.soundFilePath.endsWith('.wav')){
        return false;
      }
      soundCard.soundFileInvalidMessage = "File must be audio. (.mp3 or .wav)"
      return true;
    }
    soundCard.soundFileInvalidMessage = "Field Required"
    return true;
  }

  validateSoundFile(soundCardWithValidation: SoundCardWithValidationData) {
  //   // //Check ipcServie 
    this.ipcService.checkIfSoundFileIsvalid(soundCardWithValidation.soundFilePath).subscribe(res => {
      if (res) {
        soundCardWithValidation.isSoundFileValid = true;
        soundCardWithValidation.soundFileInvalidMessage = "";
      } else {
        soundCardWithValidation.isSoundFileValid = false;
        soundCardWithValidation.soundFileInvalidMessage = "File Not Valid.";
      }
    });
  }
  canSubmit() {
    for (let soundCard of this.soundCardWithValidationArr) {
      let isTitleValid = soundCard.isTitleValid;
      let isCategoryValid = soundCard.isCategoryValid;
      let isSoundFileFieldValid = soundCard.isSoundFileValid;

      if (!isTitleValid || !isCategoryValid || !isSoundFileFieldValid) {
        return false;
      }
    }
    return true;
  }

  addExtraSoundcard(){
    this.soundCardWithValidationArr.push(new SoundCardWithValidationData(new SoundCard(null, "","","",false,false, false, .6), false, "", false, "", false, ""))
  }
  removeCardFromList(soundCardWithValidation: SoundCardWithValidationData, currentIndex: number) {
    this.soundCardWithValidationArr.splice(currentIndex, 1);
    if (this.soundCardWithValidationArr.length == 0) {
      this.dialogRef.close();
    }
  }

  getSoundCardArrForSubmission() {
    return this.soundCardWithValidationArr.map(soundCard => new SoundCard(soundCard.runTimeId, soundCard.title, soundCard.soundFilePath, soundCard.category, soundCard.isFavorite, soundCard.showOnStreamDeck, soundCard.isCurrentlyPlaying, soundCard.currentVolume));
  }

  onCancelClick() {
    console.log(this.soundCardWithValidationArr);
    this.dialogRef.close();
  }
}
