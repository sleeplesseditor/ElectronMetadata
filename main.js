const { app, BrowserWindow, ipcMain } = require('electron');
const util = require('util');
const path = require('path');
const fs = require('fs');

const stat = util.promisify(fs.stat);

let mainWindow;

app.on('ready', () => {
    console.log('app ready');

    const htmlPath = path.join('src', 'index.html')

    mainWindow = new BrowserWindow()

    mainWindow.loadFile(htmlPath)
});

// listen for files event by browser process
ipcMain.on('files', async (event, filesArr) => {
    try {
      // asynchronously get the data for all the files
      const data = await Promise.all(
        filesArr.map(async ({ name, pathName }) => ({
          ...await stat(pathName),
          name,
          pathName
        }))
      )
  
      mainWindow.webContents.send('metadata', data)
    } catch (error) {
      // send an error event if something goes wrong
      mainWindow.webContents.send('metadata:error', error)
    }
})  