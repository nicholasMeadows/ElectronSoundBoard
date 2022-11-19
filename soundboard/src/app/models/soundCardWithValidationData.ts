import { SoundCard } from './soundcard';
export class SoundCardWithValidationData extends SoundCard {
    isTitleValid: boolean;
    titleInvalidMessage: string;
    isCategoryValid: boolean;
    categoryInvalidMessage: string;
    soundFileInvalidMessage: string;

    constructor(soundcard: SoundCard, isTitleValid: boolean, titleInvalidMessage: string, isCategoryValid: boolean, categoryInvalidMessage: string, soundFileInvalidMessage: string) {
        super(soundcard.runTimeId, soundcard.title, soundcard.soundFilePath, soundcard.category, soundcard.isFavorite, soundcard.showOnStreamDeck, soundcard.isCurrentlyPlaying, soundcard.currentVolume, soundcard.playOnPrimaryAudio, soundcard.playOnSecondaryAudio);
        this.isTitleValid = isTitleValid;
        this.titleInvalidMessage = titleInvalidMessage;
        this.isCategoryValid = isCategoryValid;
        this.categoryInvalidMessage = categoryInvalidMessage;
        this.soundFileInvalidMessage = soundFileInvalidMessage;
    }
}