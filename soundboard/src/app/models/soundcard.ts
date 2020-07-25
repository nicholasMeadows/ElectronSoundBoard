export class SoundCard{
    runTimeId: number;
    title: string;
    soundFilePath: string;
    category: string;
    isFavorite: boolean;
    showOnStreamDeck: boolean;
    isCurrentlyPlaying: boolean;
    currentVolume: number;

    
    constructor(runTimeId: number,title: string, soundFilePath: string, category: string, isFavorite: boolean, showOnStreamDeck: boolean, isCurrentlyPlaying: boolean, currentVolume: number){
        this.runTimeId = runTimeId;
        this.title = title;
        this.soundFilePath = soundFilePath;
        this.category = category;
        this.isFavorite = isFavorite;
        this.showOnStreamDeck = showOnStreamDeck;
        this.isCurrentlyPlaying = isCurrentlyPlaying;
        this.currentVolume = currentVolume;
    }
}