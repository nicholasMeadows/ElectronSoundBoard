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
    this.soundCardWithValidation = new SoundCardWithValidationData(soundCard, false, "", false, "", "");
    this.soundCardWithValidation.titleInvalidMessage
  }

  ngOnInit(): void {
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

      let invalidCategoryCharacters = ['<','>',':','\"','/','\\','|','?','*', '.'];
      for(let i = 0; i < invalidCategoryCharacters.length; ++i){
        if(this.soundCardWithValidation.category.includes(invalidCategoryCharacters[i])){
          isValid = false;
          msg = "Invalid character " + invalidCategoryCharacters[i];
          break;
        }
      }      
    }

    this.soundCardWithValidation.isCategoryValid = isValid;
    this.soundCardWithValidation.categoryInvalidMessage = msg;
    return isValid;
  }


  canSubmit(){

    let categoryValid:boolean = this.validateCategory();
    let isTitleValid:boolean = this.validateTitleInput();

    if(categoryValid && isTitleValid){
      return true;
    }
    return false;
  }

  save(){
    let title = this.soundCardWithValidation.title;
    let category = this.soundCardWithValidation.category;
    let filePath = this.soundCardWithValidation.soundFilePath;
    
    let filePathSplit = filePath.split("\\");
    let completeFileName = filePathSplit[filePathSplit.length-1];
    let extension = completeFileName.substring(completeFileName.length -4, completeFileName.length);

    let updatedFileNameWithExtension = title + extension;

    filePathSplit.pop();
    filePathSplit.pop();

    let updateFilePath = filePathSplit.join("\\") + "\\"+ category+"\\"+updatedFileNameWithExtension;

    this.dialogRef.close(new SoundCard(this.soundCard.runTimeId, title, updateFilePath, category, this.soundCard.isFavorite, this.soundCard.showOnStreamDeck, this.soundCard.isCurrentlyPlaying, this.soundCard.currentVolume, this.soundCard.playOnInGameDevice));
  }

  cancleUpdate() {
    this.dialogRef.close();
  }
}
