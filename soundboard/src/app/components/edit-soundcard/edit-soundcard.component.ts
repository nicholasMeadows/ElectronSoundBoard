import { IpcService } from './../../services/ipc-service.service';
import { Observable } from 'rxjs';
import { SoundCardWithValidationData } from './../../models/soundCardWithValidationData';
import { SoundCard } from './../../models/soundcard';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-soundcard',
  templateUrl: './edit-soundcard.component.html',
  styleUrls: ['./edit-soundcard.component.css']
})
export class EditSoundcardComponent implements OnInit {

  soundCardWithValidation: SoundCardWithValidationData;

  constructor(@Inject(MAT_DIALOG_DATA) private soundCard: SoundCard, 
  private dialogRef: MatDialogRef<EditSoundcardComponent>, 
  private ipcService: IpcService, private cd: ChangeDetectorRef) {
    this.soundCardWithValidation = new SoundCardWithValidationData(soundCard, false, "", false, "", false, "");
    this.soundCardWithValidation.titleInvalidMessage
  }

  ngOnInit(): void {
    this.validateSoundFile();
  }

  validateTitleInput() {
    let isValid = false;
    let msg = "";

    if (this.soundCardWithValidation.title.trim().length == 0) {
      isValid = false;
      msg = "Title is a required field.";
    } else {
      isValid = true;
      msg = "";
    }

    this.soundCardWithValidation.isTitleValid = isValid;
    this.soundCardWithValidation.titleInvalidMessage = msg;
    return isValid;
  }

  validateCategory() {
    let isValid = false;
    let msg = "";

    if (this.soundCardWithValidation.category.trim().length == 0) {
      isValid = false;
      msg = "Title is a required field.";
    } else {
      isValid = true;
      msg = "";
    }

    this.soundCardWithValidation.isCategoryValid = isValid;
    this.soundCardWithValidation.categoryInvalidMessage = msg;
    return isValid;
  }

  validateSoundFile() {
    let isValid = false;
    let msg = "";

    let soundFilePath = this.soundCardWithValidation.soundFilePath;

    if (soundFilePath.trim().length == 0) {
      isValid = false;
      msg = "File path is required"
    } else {
      if (!soundFilePath.endsWith(".mp3") && !soundFilePath.endsWith(".wav")) {
        isValid = false;
        msg = "File must be a .mp3 or .wav"
      } else {

        this.ipcService.checkIfSoundFileIsvalid(soundFilePath).subscribe(res => {
          if (res) {
            isValid = true;
            msg = "";
          } else {
            isValid = false;
            msg = "File is not found";
          }

          this.soundCardWithValidation.isSoundFileValid = isValid;
          this.soundCardWithValidation.soundFileInvalidMessage = msg;
          this.cd.detectChanges();
        });
      }
    }

    this.soundCardWithValidation.isSoundFileValid = isValid;
    this.soundCardWithValidation.soundFileInvalidMessage = msg;
  }

  canSubmit(){

    let isFileValid = this.soundCardWithValidation.isSoundFileValid;
    let categoryValid:boolean = this.validateCategory();
    let isTitleValid:boolean = this.validateTitleInput();

    if(categoryValid && isTitleValid && this.soundCardWithValidation.isSoundFileValid){
      return true;
    }
    return false;
  }

  save(){
    let title = this.soundCardWithValidation.title;
    let category = this.soundCardWithValidation.category;
    let filePath = this.soundCardWithValidation.soundFilePath;

    this.dialogRef.close(new SoundCard(this.soundCard.runTimeId, title, filePath, category, this.soundCard.isFavorite, this.soundCard.showOnStreamDeck, this.soundCard.isCurrentlyPlaying, this.soundCard.currentVolume));
  }

  cancleUpdate() {
    this.dialogRef.close();
  }
}
