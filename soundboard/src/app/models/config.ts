import { SoundCard } from './soundcard';
export class Config{
    audioDeviceId: string;
    soundCards: SoundCard[];

    constructor(audiodeviceId: string, soundCards: SoundCard[]){
        this.audioDeviceId = audiodeviceId;
        this.soundCards = soundCards;
    }
}