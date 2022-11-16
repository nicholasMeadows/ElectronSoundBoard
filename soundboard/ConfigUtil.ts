let fs = require('fs');
class ConfigUtil {
    appDataDir;
    appName;
    configFile;

    constructor(appDataDir, appName, musicDir) {
        this.appDataDir = appDataDir;
        this.appName = appName;

        let configFolder = this.appDataDir + "/"+this.appName+"/config"
        if(!fs.existsSync(configFolder)) {
            fs.mkdirSync(configFolder, {recursive:true});
        }

        this.configFile =  this.appDataDir + "/"+this.appName+"/config/config.json";
        if(!fs.existsSync(this.configFile)) {
            fs.closeSync(fs.openSync(this.configFile, 'w'));

            let configObj = {
                "audioDeviceId": "",
                "soundCardSearchDir": musicDir,
                "soundCards": []
            }
            this.writeConfigFile(configObj);
        }
    }
    updateSoundCardsInConfig(soundcards) {
        let configObj = this.readConfigFile();
        configObj.soundCards = soundcards;
        this.writeConfigFile(configObj);
    }

    updateSoundCard(editedSoundCard) {
        let currentConfig = this.readConfigFile();
        
        let foundSoundCardIndex = currentConfig.soundCards.findIndex(sound => {
            return editedSoundCard.runTimeId == sound.runTimeId;
        });
        let foundSoundCard = currentConfig.soundCards[foundSoundCardIndex];

        if(foundSoundCard != undefined) {
            if(editedSoundCard.category != foundSoundCard.category) {
                let categoryFolderDir = currentConfig.soundCardSearchDir + "/" +editedSoundCard.category;
                if(!fs.existsSync(categoryFolderDir)) {
                    fs.mkdirSync(categoryFolderDir, {recursive:true});
                }
            }

            let updatedSoundFile = editedSoundCard.soundFilePath
            let oldSoundFile = foundSoundCard.soundFilePath
            fs.rename(oldSoundFile, updatedSoundFile, (err) => {
                if(err) throw err;
                console.log('Successfully moved' + foundSoundCard.soundFilePath + " to "+editedSoundCard.soundFilePath)

                let oldSoundFilePathSplit = oldSoundFile.split("\\");
                oldSoundFilePathSplit.pop();
                let oldSoundFilePathParentFolder  = oldSoundFilePathSplit.join("\\");
                let existingFilesInOldFolder = fs.readdirSync(oldSoundFilePathParentFolder)
                let filteredSoundsInOldFolder = existingFilesInOldFolder.filter(file => {
                    if(file.endsWith('.mp3') || file.endsWith(".wav")) {
                        return true;
                    }
                    return false;
                })

                if(filteredSoundsInOldFolder.length == 0){
                    fs.rmdirSync(oldSoundFilePathParentFolder, {recursive: true})
                }
            });


            currentConfig.soundCards[foundSoundCardIndex] = editedSoundCard;
            this.writeConfigFile(currentConfig);
        }
    }

    updateAudioDeviceIdInConfig(deviceId) {
        let configObj = this.readConfigFile();
        configObj.audioDeviceId = deviceId;
        this.writeConfigFile(configObj);
    }

    updateAudioDeviceForInGameChannelIdInConfig(deviceId) {
        let configObj = this.readConfigFile();
        configObj.audioDeviceIdForInGameChannel = deviceId;
        this.writeConfigFile(configObj);
    }
    
    readConfigFile() {
        return JSON.parse(fs.readFileSync(this.configFile));
    }

    writeConfigFile(configObjToWrite) {
        fs.writeFileSync(this.configFile, JSON.stringify(configObjToWrite));
    }
}
module.exports = ConfigUtil;