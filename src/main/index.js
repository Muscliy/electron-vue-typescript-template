// 'use strict'

import { app, BrowserWindow } from 'electron'

import '@babel/polyfill'
import Transport from '@ledgerhq/hw-transport-node-hid'
// import Transport from "@ledgerhq/hw-transport-web-usb";
// import Transport from "@ledgerhq/react-native-hw-transport-ble";
import AppBtc from '@ledgerhq/hw-app-btc'

const getBtcAddress = async() => {
  console.log("")
  const transport = await Transport.create()
  const btc = new AppBtc(transport)
  const result = await btc.getWalletPublicKey("44'/0'/0'/0/0")
  return result.bitcoinAddress
}
getBtcAddress().then(a => console.log(a))

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
