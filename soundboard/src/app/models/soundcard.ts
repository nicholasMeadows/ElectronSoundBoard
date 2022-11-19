export class SoundCard{
    runTimeId: number;
    title: string;
    soundFilePath: string;
    category: string;
    isFavorite: boolean;
    showOnStreamDeck: boolean;
    isCurrentlyPlaying: boolean;
    currentVolume: number;
    playOnPrimaryAudio: boolean;
    playOnSecondaryAudio: boolean

    
    constructor(runTimeId: number,title: string, soundFilePath: string, category: string, isFavorite: boolean, showOnStreamDeck: boolean, isCurrentlyPlaying: boolean, currentVolume: number, playOnPrimaryAudio: boolean, playOnSecondaryAudio: boolean){
        this.runTimeId = runTimeId;
        this.title = title;
        this.soundFilePath = soundFilePath;
        this.category = category;
        this.isFavorite = isFavorite;
        this.showOnStreamDeck = showOnStreamDeck;
        this.isCurrentlyPlaying = isCurrentlyPlaying;
        this.currentVolume = currentVolume;
        this.playOnPrimaryAudio = playOnPrimaryAudio;
        this.playOnSecondaryAudio = playOnSecondaryAudio;
        
    }
}