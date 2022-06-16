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

    updateAudioDeviceIdInConfig(deviceId) {
        let configObj = this.readConfigFile();
        configObj.audioDeviceId = deviceId;
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