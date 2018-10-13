import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { spawn } from 'child_process';
process.env.NETWORK = 'olivia';

let webcontents;
// const core = spawn(join(__dirname + '.unpacked', 'node_modules/node/bin/node'), [join(__dirname + '.unpacked', 'node_modules/leofcoin-core/bin/cli.js'), '--network', 'olivia']);
const core = spawn(join(__dirname, 'node_modules/node/bin/node'), [join(__dirname, 'node_modules/leofcoin-core/bin/cli.js'), '--network', 'olivia']);

core.stderr.on('data', errorData => {
  errorData = errorData.toString();
  if (!errorData.includes('connect ECONNREFUSED 127.0.0.1:5001') &&
      !errorData.includes('rejection id: 1') &&
      !errorData.includes('[DEP0018]')) {
    dialog.showErrorBox('error', errorData)
    webcontents.send('errormessage', errorData);
  }

});

core.stdout.on('data', data => {
  webcontents.send('message', data.toString());
});

core.on('error', data => {
  data = data.toString();
  dialog.showErrorBox('error', data)
  webcontents.send('message', data);
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  core.kill('SIGKILL')
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegrationInWorker: true
    },
    frame: false
  });

  webcontents = mainWindow.webContents;
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    // core.process.emit('SIGINT')
    // core.exit();
    core.kill('SIGKILL')
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
