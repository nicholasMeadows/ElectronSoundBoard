let fs = require('fs');
const { app, BrowserWindow, Menu, ipcMain, IpcMessageEvent } = require('electron')

let audioMenuLabel = 'Audio Devices';

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 700,
    backgroundColor: '#ffffff',
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

function updateSoundCardsInConfig(soundcards) {
  let configObj = readConfigFile();
  configObj.soundCards = soundcards;
  writeConfigFile(configObj);
}

function updateAudioDeviceIdInConfig(deviceId) {
  let configObj = readConfigFile();
  configObj.audioDeviceId = deviceId;
  writeConfigFile(configObj);
}

function readConfigFile() {
  return JSON.parse(fs.readFileSync('config.json'));
}

function writeConfigFile(configObjToWrite){
  fs.writeFileSync('config.json', JSON.stringify(configObjToWrite));
}

// let currentAudioDeviceId='';
//IPC Events!!!

ipcMain.on('config:loadConfig', (event, args)=> {
  let config = readConfigFile();
  event.reply('config:loadConfigResponse', config);
});

ipcMain.on('config:updateConfig', (event, soundcards) => {
  updateSoundCardsInConfig(soundcards);
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
        updateAudioDeviceIdInConfig(device.deviceId);
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
  let configDeviceId = readConfigFile().audioDeviceId;
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

let ipcMessageEvent;
ipcMain.on("audio:startPlaying", (event, soundCard) => {
  ipcMessageEvent = event;
  win.webContents.send("audio:startplaying", soundCard)
})

ipcMain.on("audio:stopPlaying", (event, soundCard) => {
  win.webContents.send("audio:stopplaying")
})

ipcMain.on("audio:audiofinished", (event, soundCard) => {
  ipcMessageEvent.sender.send("audio:audiofinishedTest", soundCard)
});

ipcMain.on("audio:volumechange", (event, volumeToSet) => {
  win.webContents.send("audio:volumechange", volumeToSet);
});

ipcMain.on("file:checkIfFileExists", (event, fileToCheck) => {
  fs.exists(fileToCheck, (exists)=> {
    console.log("main.js", exists);
    event.sender.send("file:checkIfFileExistsResponse", exists);
  }); 
})