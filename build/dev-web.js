const chalk = require('chalk')
const path = require('path')
const { say } = require('cfonts')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')


const config = require('../config')
const rendererConfig = require('./webpack.dev.conf')

let electronProcess = null
let manualRestart = false
let hotMiddleware

function logStats (proc, data) {
  let log = ''

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

function greeting () {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 104) text = 'electron-vue'
  else if (cols > 76) text = 'electron-|vue'
  else text = false

  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    })
  } else console.log(chalk.yellow.bold('\n  electron-vue'))
  console.log(chalk.blue('  getting ready...') + '\n')
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

function startRenderer () {


  return new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
      if (err) {
        reject(err)
      } else {
        // console.log(devWebpackConfig.module.rules)
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        // Add FriendlyErrorsPlugin
        rendererConfig.plugins = rendererConfig.plugins || [];
        rendererConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${rendererConfig.devServer.host}:${port}`],
          },
          onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
        }))

        rendererConfig.entry.app = [path.join(__dirname, 'dev-client')].concat(rendererConfig.entry.app)
        rendererConfig.mode = 'development'
        const compiler = webpack(rendererConfig)
        hotMiddleware = webpackHotMiddleware(compiler, {
          log: false,
          heartbeat: 2500
        })

        compiler.hooks.compilation.tap('compilation', compilation => {
          compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('html-webpack-plugin-after-emit', (data, cb) => {
            hotMiddleware.publish({ action: 'reload' })
            cb()
          })
        })

        compiler.hooks.done.tap('done', stats => {
          logStats('Renderer', stats)
        })

        const server = new WebpackDevServer(compiler)
        server.listen(port)
      }
    })

  })
}


function init () {
  greeting()

  Promise.all([startRenderer()])
    .then(() => {
    })
    .catch(err => {
      console.error(err)
    })
}


init()
