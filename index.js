const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const electronInstaller = require('electron-winstaller');
const path = require('path');


if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function createWindow() {
  win = new BrowserWindow({
      width: 900,
      height: 600,
      frame: false,
      icon: 'img/popcorn.png',
      hasShadow: true,
      autoHideMenuBar: true,
      webPreferences: {
          devTools: true,
          nodeIntegration: true,
          contextIsolation: false,
      }
  })

  win.loadFile('./pages/index.html')
}

ipcMain.on('close-btn', () => {
  win.close()
})

ipcMain.on('minimize-btn', () => {
  win.minimize();
})

ipcMain.on('maximize-btn', () => {
  if (win.isMaximized()) {
      win.unmaximize();
  } else {
      win.maximize();
  }

})

app.whenReady().then(() => {
  createWindow()
  try {
      require('electron-reloader')(module)
  } catch (_) {}

  app.on('activate', function() {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})



function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }
  const ChildProcess = require('child_process');
  const path = require('path');
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);
  const spawn = function(command, args) {
      let spawnedProcess, error;
      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}
      return spawnedProcess;
  };
  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus
          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);
          setTimeout(application.quit, 1000);
          return true;
      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers
          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);
          setTimeout(application.quit, 1000);
          return true;
      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated
          application.quit();
          return true;
  }
};