// const WebSocket = require('ws');
const Socket = require('ws');

class CustomWebSocket {
    ws;
    configUtil;
    startPlayingAudio;
    stopPlayingAudio;

    constructor(configUtil, startPlayingAudio, stopPlayingAudio) {
        this.configUtil = configUtil;
        this.startPlayingAudio = startPlayingAudio;
        this.stopPlayingAudio = stopPlayingAudio;
    }

    createWebSocket() {
        let wss = new Socket.Server({ port: 1234 });


        wss.on("connection", (ws) => {
            this.ws = ws;
            this.sendConfigToStreamDeck();
            ws.on("message", (message) => {
                this.processMessage(JSON.parse(message));
            });
        });
    }

    processMessage(message) {
        console.log('received: %s from streamdeck', message);
        if (undefined != message && undefined != message.eventType) {
            
            switch (message.eventType.toLowerCase()) {
                case "startsound": this.startPlayingAudio(message.data);
                    break;
                case "stopsound": this.stopPlayingAudio(message.data);
                    break;
            }
        }
    }

    // getSoundButtonsFromConfig() {
    //     console.log(this.configUtil.readConfigFile().soundCards);
    // }

    sendConfigToStreamDeck() {
        // console.log(this.main);
        let soundCards = this.configUtil.readConfigFile().soundCards;
        let soundCardsToSend = soundCards.filter(soundcard => soundcard.showOnStreamDeck);
        let eventType = "incomingsoundcards";
        this.sendDataToWebSocket(new SoundBoardWebSocketPayload(eventType, soundCardsToSend));
    }

    soundStartedPlaying(soundCard) {
        if (soundCard.showOnStreamDeck)
            this.sendDataToWebSocket(new SoundBoardWebSocketPayload("soundstarted", soundCard));
    }

    soundStoppedPlaying(soundCard) {
        if (soundCard.showOnStreamDeck)
            this.sendDataToWebSocket(new SoundBoardWebSocketPayload("soundstopped", soundCard));
    }

    sendDataToWebSocket(data) {
        if (this.ws) {
            // console.log("sending data to streamdeck", data)

            this.ws.send(JSON.stringify(data));
        }
    }
}

class SoundBoardWebSocketPayload {
    eventType;
    data;
    constructor(eventType, data) {
        this.eventType = eventType;
        this.data = data;
    }
}

module.exports = CustomWebSocket