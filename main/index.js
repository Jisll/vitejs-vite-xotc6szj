const { protocol, app, BrowserWindow, dialog, globalShortcut } = require('electron');
const { execSync, spawn } = require('child_process');
const { join } = require('path');
const path = require('path');
const fs = require('fs'); // Import the fs module
const https = require('https');
const listener = require('./listener');
const { existsSync, mkdirSync, unlinkSync, writeFileSync } = require('fs');
const sudo = require('sudo-prompt');
const { autoUpdater } = require('electron-updater');

const Server = require('./modules/Server');
const Service = require('./modules/Service');
const LanguageServer = require('./modules/LanguageServer');

const ApplicationProvider = require('./providers/ApplicationProvider');
const ClientProvider = require('./providers/ClientProvider');
const ConfigurationProvider = require('./providers/ConfigurationProvider');
const RobloxProvider = require('./providers/RobloxProvider');
const UserProvider = require('./providers/UserProvider');
const WorkspaceProvider = require('./providers/WorkspaceProvider');
const versionInfo = require('win-version-info');
const { createExtractorFromFile } = require('node-unrar-js');

const resolveFile = (pathh) => {
	const baseUrl = join(__dirname, '../out');

	return join(baseUrl, pathh.length > 0 ? pathh : 'index.html');
}

// Function to download the file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        // Start downloading the file
        https.get(url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
                // Close the file after finishing the download
                file.close((err) => {
                    if (err) reject(err);
                    else resolve(); // Resolve the promise when the file is closed
                });
            });

        }).on('error', (err) => { // Handle errors
            // Delete the file if an error occurs
            fs.unlink(dest, () => reject(err));
        });
    });
};


const downloadFileAsynca = async (file, outName) => {
	const bin = join(process.cwd(), 'bin');
	if (!existsSync(bin))
		mkdirSync(bin);
	if (existsSync(join(bin, outName)))
		unlinkSync(join(bin, outName));

	const response = await fetch(file);

	const buffer = await response.arrayBuffer();

	writeFileSync(
		join(bin, outName),
		Buffer.from(buffer)
	);
}

// Function to run the .exe file and wait for it to finish
const runFileAndWait = (filePath) => {
    return new Promise((resolve, reject) => {
        const process = spawn(filePath, { stdio: 'inherit' });

        process.on('close', (code) => {
            code === 0 ? resolve() : reject(new Error(`Exit code: ${code}`));
        });

        process.on('error', (err) => reject(err));
    });
};

// Function to check version and download if necessary
const findOrApplyBloxstrap = async () => {
	try{
    const folderPath = path.join(process.env.LOCALAPPDATA, 'Bloxstrap');
	const executableBlox = path.join(folderPath, 'Bloxstrap.exe');
    if (fs.existsSync(folderPath) && existsSync(executableBlox)) {
        try {
			var info;
			try{
            	info = versionInfo(executableBlox); // Assuming versionInfo function exists
			}
			catch(error)
			{
				const result = await dialog.showMessageBox({
					type: 'info',
					title: 'Set up required',
					message: 'We need to apply a patch to Bloxstrap to keep you on the correct Roblox version.',
					buttons: ['Ok']
				});
				
				if (result.response === 0) {
					try
					{
						fs.rmSync(folderPath, { recursive: true, force: true });
					}
					catch(error)
					{
						const result = await dialog.showMessageBox({
							type: 'info',
							title: 'Set up required',
							message: 'Failed to delete bloxstrap. Delete %localappdata%/Bloxstrap then click Ok',
							buttons: ['Ok']
						});
					}
					const fileUrl = 'https://cdn.getwave.gg/setupfiles/Bloxstrap.exe';
					const bin = join(process.cwd(), 'bin');
					if (!existsSync(bin))
						mkdirSync(bin);
					const filePath = path.join(bin, 'Bloxstrap.exe');
		
					try {
						await downloadFileAsynca(fileUrl, 'Bloxstrap.exe');
						await runFileAndWait(filePath);
					} catch (error) {
						dialog.showErrorBox('Wave', `Failed to install Bloxstrap: ${error.message}`);
						app.quit();
					}
				}
				return;
			}
            if (info.ProductVersion !== "4.2.0") {
				const result = await dialog.showMessageBox({
					type: 'info',
					title: 'Set up required',
					message: 'We need to apply a patch to Bloxstrap to keep you on the correct Roblox version.',
					buttons: ['Ok']
				});
				
				if (result.response === 0) {
					try
					{
						fs.rmSync(folderPath, { recursive: true, force: true });
					}
					catch(error)
					{
						const result = await dialog.showMessageBox({
							type: 'info',
							title: 'Set up required',
							message: 'Failed to delete bloxstrap. Delete %localappdata%/Bloxstrap then click Ok',
							buttons: ['Ok']
						});
					}
					const fileUrl = 'https://cdn.getwave.gg/setupfiles/Bloxstrap.exe';
					const bin = join(process.cwd(), 'bin');
					if (!existsSync(bin))
						mkdirSync(bin);
					const filePath = path.join(bin, 'Bloxstrap.exe');
		
					try {
						await downloadFileAsynca(fileUrl, 'Bloxstrap.exe');
						await runFileAndWait(filePath);
					} catch (error) {
						dialog.showErrorBox('Wave', `Failed to install Bloxstrap: ${error.message}`);
						app.quit();
					}
				}
            }
        } catch (error) {
            dialog.showErrorBox('Wave', `Failed to get Bloxstrap version info: ${error.message}`);
            app.quit();
        }
    } else {
        const result = await dialog.showMessageBox({
            type: 'info',
            title: 'Set up required',
            message: 'We need to install and apply a patch to Bloxstrap to keep you on the correct Roblox version.',
            buttons: ['Ok']
        });

        if (result.response === 0) {
            const fileUrl = 'https://cdn.getwave.gg/setupfiles/Bloxstrap.exe';
			const bin = join(process.cwd(), 'bin');
			if (!existsSync(bin))
				mkdirSync(bin);
            const filePath = path.join(bin, 'Bloxstrap.exe');

            try {
                await downloadFileAsynca(fileUrl, 'Bloxstrap.exe');
                await runFileAndWait(filePath);
            } catch (error) {
                dialog.showErrorBox('Wave', `Failed to install Bloxstrap: ${error.message}`);
                app.quit();
            }
        }
    }
}
catch(error)
{
	dialog.showErrorBox('Wave', `Failed to install Bloxstrap: ${error.message}`);
	app.quit();
}
};

const startClientManager = () => {
    const executable = join(process.cwd(), 'bin', 'ClientManager.exe');
    const dllFile = join(process.cwd(), 'bin', 'Wave.dll');
    
    if (!existsSync(executable) || !existsSync(dllFile)) {
        dialog.showMessageBox({
            type: 'error',
            title: 'Failed to find ClientManager.exe/Wave.dll in bin folder',
            message: 'Please disable any anti-virus you have running, then reopen Wave. If that does not work attempt a VPN.',
            buttons: ['Ok']
        }).then(result => {
            if (result.response === 0) {
                app.quit();
            }
        });
        return;
    }
    
    const workingDirectory = join(process.cwd(), 'bin');
    
    const launchClientManager = () => {
		try{

		
        const clientManager = spawn(executable, [], {
            cwd: workingDirectory,
            detached: true,
            stdio: 'ignore',
            shell: false,
            windowsHide: true,
        });

        clientManager.unref();

        // Event listener for when the process exits
        clientManager.on('exit', (code, signal) => {
			listener.emit('console/success', `ClientManager.exe exited with code ${code}. Restarting...`);
            setTimeout(launchClientManager, 1000);
        });

        // Event listener for when an error occurs while starting the process
        clientManager.on('error', (err) => {
			listener.emit('console/success', 'Failed to start ClientManager.exe. Attempting again...');
            setTimeout(launchClientManager, 1000);
        });
	}
	catch(err)
	{
		listener.emit('console/success', `Failed to start ClientManager.exe with error: ${err}. Attempting again...`);
		setTimeout(launchClientManager, 1000);
	}
    };
    launchClientManager();
};

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
]);

app.on('ready', async () => {
	(async () => {
		try {
			const isElevated = (await import('is-elevated')).default;
			
			const elevated = await isElevated();
			if (!elevated) {
				sudo.exec(process.execPath, { name: 'Wave' }, err => {
					if (err)
						dialog.showErrorBox('Wave', 'Wave requires elevated permissions to function properly.');
			
					app.quit();
				});
			} else{
				const window = new BrowserWindow({
					width: 1024,
					height: 768,
					minWidth: 650,
					minHeight: 400,
					titleBarStyle: 'hidden',
					autoHideMenuBar: true
				});
				if (app.isPackaged) {
					await app.whenReady();
		
					protocol.registerFileProtocol('app', (request, callback) => {
						let url = request.url.substr(6).replace('index.html/', '');
		
						let path = resolveFile(url);
		
						callback({ path });
					});
		
					window.loadURL('app://index.html');
				} else {
					window.loadURL('http://localhost:3000');
		
					window.webContents.on('did-fail-load', () => {
						window.webContents.reloadIgnoringCache();
					});
				}
				try {
					const server = new Server(45624);
		
					const service = new Service(server.server);
		
					new LanguageServer(43578);
		
					service.registerServiceProvider(ApplicationProvider(window));
		
					service.registerServiceProvider(ClientProvider);
		
					service.registerServiceProvider(ConfigurationProvider);
		
					service.registerServiceProvider(RobloxProvider);
		
					service.registerServiceProvider(UserProvider);
		
					service.registerServiceProvider(WorkspaceProvider);
				} catch {
					app.quit();
		
					process.exit(1);
				}
				// Listener for when an update is available
				autoUpdater.once('update-available', (info) => {
					dialog.showMessageBox({
						type: 'info',
						title: 'Update Available',
						message: 'New UI Version. Downloading now...'
						})
				});
		
				autoUpdater.on('download-progress', (progressObj) => {
					// Calculate the current progress percentage as a whole number
					let currentPercent = Math.floor(progressObj.percent);
				
					// Check if the currentPercent is a multiple of 10
					if (currentPercent % 10 === 0) {
						// Construct the log message
						let log_message = `UI Update Progress: ${currentPercent}%`;
				
						// Emit the log message
						listener.emit('console/success', log_message);
					}
				});
		
				// Listener for update errors
				autoUpdater.once('error', (error) => {
						dialog.showErrorBox('Update Error', error == null ? 'unknown' : (error.stack || error).toString());
				});
		
				// Add listener for when the update is downloaded
				autoUpdater.on('update-downloaded', () => {
					dialog.showMessageBox({
					type: 'info',
					title: 'Update Ready',
					message: 'A new UI version has been downloaded. Restart the app to apply the updates.',
					buttons: ['Restart Now']
					}).then(result => {
						if (result.response === 0) { // If 'Restart Now' is clicked
							autoUpdater.quitAndInstall(); // Restart and install the update
						}
					});
				});
				
				// Start the update check process
				autoUpdater.checkForUpdatesAndNotify();
				
				await findOrApplyBloxstrap();
				const devCheckFile = join(process.cwd(), 'dev.txt');
			
				if (existsSync(devCheckFile))
				{
					return;
				}
		
				try {
					const { clientVersionUpload } = await (await fetch('https://clientsettingscdn.roblox.com/v2/client-version/WindowsPlayer')).json();
		
					if (!clientVersionUpload)
						throw { message: 'Failed to fetch the client version.', exit: true };
		
					try {
						const bin = join(process.cwd(), 'bin');
		
						const temp = join(process.cwd(), 'temp.json');
		
						if (!existsSync(bin))
							mkdirSync(bin);
		
						let { clientManager, module } = existsSync(temp) ? require(temp) : { clientManager: undefined, module: undefined };
		
						const downloadFileAsync = async (file) => {
							try{
							if (existsSync(join(bin, file)))
								unlinkSync(join(bin, file));
		
							const response = await fetch(`https://cdn.getwave.gg/versions/${clientVersionUpload}/${file}`);
		
							const buffer = await response.arrayBuffer();
		
							const hash = response.headers.get('etag').replace(/"/g, '');
		
							writeFileSync(
								join(bin, file),
								Buffer.from(buffer)
							);
		
							if (file === 'ClientManager.exe')
								clientManager = hash;
							else if (file === 'Wave.dll')
								module = hash;
		
							writeFileSync(temp, JSON.stringify({
								clientManager: file === 'ClientManager.exe' ? hash : clientManager,
								module: file === 'Wave.dll' ? hash : module
							}, null, 4));
						}
						catch(err)
						{
							dialog.showMessageBox({
								type: 'error',
								title: 'Failed to download needed files',
								message: 'Please disable any anti-virus you have running, then reopen Wave. If that does not work attempt a VPN.',
								buttons: ['Ok']
								}).then(result => {
									if (result.response === 0) { // If 'Restart Now' is clicked
										app.quit();
									}
								});
						}
						}
		
						const getHashAsync = async (file) => {
							const response = await fetch(`https://cdn.getwave.gg/versions/${clientVersionUpload}/${file}`, { method: 'HEAD' });
		
							return response.headers.get('etag').replace(/"/g, '');
						}
		
						const downloadAll = async () => {
							try{
							if (existsSync(join(bin, 'ClientManager.exe'))) {
								if (!clientManager)
									await downloadFileAsync('ClientManager.exe');
								else {
									const hash = await getHashAsync('ClientManager.exe');
		
									if (clientManager !== hash) {
										await downloadFileAsync('ClientManager.exe');
									}
								}
							} else {
								await downloadFileAsync('ClientManager.exe');
							}
		
							if (existsSync(join(bin, 'Wave.dll'))) {
								if (!module)
									await downloadFileAsync('Wave.dll');
								else {
									const hash = await getHashAsync('Wave.dll');
		
									if (module !== hash) {
										await downloadFileAsync('Wave.dll');
									}
								}
							} else {
								await downloadFileAsync('Wave.dll');
							}
						}
						catch(err)
						{
							dialog.showMessageBox({
								type: 'error',
								title: 'Failed to download needed files',
								message: 'Please disable any anti-virus you have running, then reopen Wave. If that does not work attempt a VPN.',
								buttons: ['Ok']
								}).then(result => {
									if (result.response === 0) { // If 'Restart Now' is clicked
										app.quit();
									}
								});
						}
						}
		
						await downloadAll();
		
						startClientManager();
		
						listener.emit('console/success', 'Wave is up to date.');
					} catch (err) {
						throw { message: 'Wave is currently out of date, Would you like to continue?', exit: false };
					}
				} catch (err) {
					const { message, exit } = err;
		
					const { response } = await dialog.showMessageBox(window, {
						type: 'error',
						title: 'Wave',
						message,
						buttons: exit ? ['Exit'] : ['Continue', 'Exit']
					});
		
					if (exit || response === 1)
						app.quit();
				}
			}
		} catch (error) {
			dialog.showErrorBox('Wave', `Wave failed to check elevation status: ${error}`);
		}
	})();
});

app.on('browser-window-focus', function () {
	globalShortcut.register("CommandOrControl+R", () => { });

	globalShortcut.register("F5", () => { });
});

app.on('browser-window-blur', function () {
	globalShortcut.unregister('CommandOrControl+R');
	globalShortcut.unregister('F5');
});

app.on('window-all-closed', () => {
	if (process.platform === 'darwin')
		return;

	app.quit();
});	