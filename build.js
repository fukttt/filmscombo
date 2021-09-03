
var electronInstaller = require('electron-winstaller');

// In this case, we can use relative paths
var settings = {
    // Specify the folder where the built app is located
    appDirectory: './FilmsCombo-linux-x64',
    // Specify the existing folder where 
    outputDirectory: './FilmsCombo-setups',
    // The name of the Author of the app (the name of your company)
    authors: 'Our Code World Inc.',
    description: 'Some desc',
    // The name of the executable of your built
    exe: './FilmsCombo',
    setupIcon: './icon.ico'
};

resultPromise = electronInstaller.createWindowsInstaller(settings);
 
resultPromise.then(() => {
    console.log("The installers of your application were succesfully created !");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`)
});