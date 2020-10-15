const config = require("../config/config")

const {
  Wechaty,
  ScanStatus,
  log,
}   = require('wechaty')

const { PuppetPadplus } = require("wechaty-puppet-padplus")

const replyToAMessage = require("./utils/reply")

function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

      const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
      ].join('')

      log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

  } else {
      log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg) {
  log.info('StarterBot', msg)
  var reply = await replyToAMessage(msg)
  await msg.say(reply)
}

function onMini(msg){
  log.info('onMini', msg)
}

const bot = new Wechaty({
  name: config.name,
  puppet: new PuppetPadplus({
      token: config.token
  })
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
// bot.on('mini',onMini)

bot.start()
.then(() => log.info('StarterBot', 'Starter Bot Started.'))
.catch(e => log.error('StarterBot', e))