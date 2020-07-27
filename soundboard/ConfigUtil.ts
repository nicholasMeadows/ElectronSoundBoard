let fs = require('fs');
class ConfigUtil {
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
        return JSON.parse(fs.readFileSync('config.json'));
    }

    writeConfigFile(configObjToWrite) {
        fs.writeFileSync('config.json', JSON.stringify(configObjToWrite));
    }
}
module.exports = ConfigUtil;