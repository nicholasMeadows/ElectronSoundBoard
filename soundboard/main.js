const CustomWebSocket = require('./StreamDeckWebSocket.ts');
const ConfigUtil = require('./ConfigUtil.ts');


let configUtil = new ConfigUtil();

let fs = require('fs');
const { app, BrowserWindow, Menu, ipcMain, IpcMessageEvent } = require('electron')

let streamDeckWebSocket = new CustomWebSocket(configUtil, startPlayingAudio, stopPlayingAudio);

let audioMenuLabel = 'Audio Devices';

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    icon: 'appIcon.png',
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




//IPC Events!!!
ipcMain.on('config:loadConfig', (event, args)=> {
  let config = configUtil.readConfigFile();
  event.reply('config:loadConfigResponse', config);
});

ipcMain.on('config:updateConfig', (event, soundcards) => {
  configUtil.updateSoundCardsInConfig(soundcards);
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