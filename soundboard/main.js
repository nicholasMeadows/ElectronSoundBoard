const CustomWebSocket = require('./StreamDeckWebSocket.ts');
const ConfigUtil = require('./ConfigUtil.ts');

let fs = require('fs');
const { app, BrowserWindow, Menu, ipcMain, IpcMessageEvent, webContents, shell } = require('electron');
const { pathToFileURL } = require('url');

let configUtil = new ConfigUtil(app.getPath("appData"), app.name, app.getPath("music"));
let streamDeckWebSocket = new CustomWebSocket(configUtil, startPlayingAudio, stopPlayingAudio, streamDeckPlayRandomSound, streamDeckPlayRandomHypeSongOrStopIfAlreadyPlaying);

let audioMenuLabel = 'Audio Devices';

let win;

//Working
// icon: __dirname + "\\appIcon.png",

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    icon: __dirname + "/appIcon.ico",
    webPreferences: {
      nodeIntegration: true
    }
  })


  win.loadURL(`file://${__dirname}/dist/soundboard/index.html`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })

  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})


// Create menu template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  },{
    label: "Options",
    submenu: [
      {
        label: "Play All",
        accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
        click() {
          playAllClicked();
        }
      },{
        label: "Play Random",
        accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+E',
        click() {
          playRandomClicked();
        }
      },{
        label: "Play 10 Random",
        accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+R',
        click() {
          play10RandomClicked();
        }
      },{
        label: "Play All EarRape",
        accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+T',
        click() {
          playEarRapeClicked();
        }
      },{
        label: "Open Discord API Sound Page",
        click() {
          shell.openPath('microsoft-edge:http://discordbotserver:9000/SoundboardBotRequestSite/')
        }
      }
    ]
  }
];

// Add developer tools item if not in prod
if (process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }, {
        role: 'reload'
      }
    ]
  })
}

function startPlayingAudio(soundCard){
  win.webContents.send("streamdeckstartaudio", soundCard);
}

function stopPlayingAudio(soundCard){
  win.webContents.send("streamdeckstopaudio", soundCard);
}

function streamDeckPlayRandomSound() {
  win.webContents.send("playRandomClicked", {});
}

function streamDeckPlayRandomHypeSongOrStopIfAlreadyPlaying() {
  win.webContents.send("playRandomHypeSongOrStopIfAlreadyPlaying", {});
}

//IPC Events!!!
function playAllClicked() {
  win.webContents.send("playAllClicked");
}

function playRandomClicked() {
  win.webContents.send("playRandomClicked");
}
function play10RandomClicked() {
  win.webContents.send("play10RandomClicked");
}

function playEarRapeClicked() {
  win.webContents.send("playEarRapeClicked");
}

function cleanAndUpdateConfig(config) {
  let soundCardSearchDir = config.soundCardSearchDir;
  let dirArr = fs.readdirSync(soundCardSearchDir);
  dirArr.forEach(dir => {
    if (dir != '$RECYCLE.BIN' && fs.lstatSync(soundCardSearchDir + '\\' + dir).isDirectory()) {
      let files = fs.readdirSync(soundCardSearchDir + '\\' + dir);
      files.forEach(file => {
        if (file.endsWith('.mp3') || file.endsWith('.wav')) {
          let completeFile = soundCardSearchDir + '\\' + dir + '\\' + file;

          let index = config.soundCards.findIndex(sound => {
            return sound.soundFilePath == completeFile
          });

          if (index < 0) {
            console.log('file not in config', completeFile)

            let dirSplit = completeFile.split("\\");
            let fileNameWithExtension = dirSplit[dirSplit.length -1];
            let fileNameWithoutExtension = fileNameWithExtension.substring(0,fileNameWithExtension.length -4);

            let soundObjToAdd = {
                "runTimeId": 0,
                "title": fileNameWithoutExtension,
                "soundFilePath": completeFile,
                "category": dirSplit[dirSplit.length-2],
                "isFavorite": false,
                "showOnStreamDeck": false,
                "isCurrentlyPlaying": false,
                "currentVolume": 0.8
            }
            config.soundCards.push(soundObjToAdd);
          }
        }
      })
    }
  })

  let correctedSounds = [];
  config.soundCards.forEach(sound => {
    if(fs.existsSync(sound.soundFilePath)){
      correctedSounds.push(sound);
    }
  })
  config.soundCards = correctedSounds;

  configUtil.writeConfigFile(config);
}

ipcMain.on('config:loadConfig', (event, args)=> {
  let config = configUtil.readConfigFile();
  cleanAndUpdateConfig(config);
  event.reply('config:loadConfigResponse', config);
});

ipcMain.on('config:updateConfig', (event, soundcards) => {
  configUtil.updateSoundCardsInConfig(soundcards);
});

ipcMain.on('config:updateSound', (event, editedSoundCard) => {
  configUtil.updateSoundCard(editedSoundCard);
});

ipcMain.on("audiodevice:audiodevicelist", (event, args) => {
  let audioDeviceSubMenu = [];
  args.forEach(device => {
    audioDeviceSubMenu.push({
      type: 'radio',
      label: device.deviceName,
      deviceId: device.deviceId,
      click() {
        win.webContents.send("audiodevice:updatecurrentdevice", device.deviceId);
        configUtil.updateAudioDeviceIdInConfig(device.deviceId);
      }
    })
  });

  let audioMenuItem = mainMenuTemplate.find((menu, inext) => {
    return menu.label == audioMenuLabel;
  });

  if (audioMenuItem) {
    audioMenuItem.submenu = audioDeviceSubMenu;
  } else {
    mainMenuTemplate.push({
      label: audioMenuLabel,
      submenu: audioDeviceSubMenu
    });
  }
  let configDeviceId = configUtil.readConfigFile().audioDeviceId;
  let foundDeviceSubMenu = audioDeviceSubMenu.filter((item, index) => {
    return item.deviceId == configDeviceId;
  });

  if(foundDeviceSubMenu.length > 0){
    foundDeviceSubMenu[0].checked=true; 
    win.webContents.send("audiodevice:updatecurrentdevice", configDeviceId);
  }
  
  const menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu);
});

ipcMain.on("file:checkIfFileExists", (event, fileToCheck) => {
  fs.exists(fileToCheck, (exists)=> {
    console.log("main.js", exists);
    event.sender.send("file:checkIfFileExistsResponse", exists);
  }); 
});

//Stream deck ipc events
ipcMain.on("streamdeck:initwebsocket", (event, nullData) =>{
  streamDeckWebSocket.createWebSocket();
})

ipcMain.on("streamdeck:updatecards", (nullData)=>{
  streamDeckWebSocket.sendConfigToStreamDeck();
});

ipcMain.on("streamdeck:startplaying", (event, soundCard)=>{
  streamDeckWebSocket.soundStartedPlaying(soundCard);
});
ipcMain.on("streamdeck:stopplaying", (event, soundCard)=>{
  streamDeckWebSocket.soundStoppedPlaying(soundCard);
});