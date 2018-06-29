const BotML = require('botml')

const bot = new BotML([
  'dialogs/smalltalk.bot'
])

if (require.main === module) {
  //const bot = initBot()
  bot.start()
  // bot.on('reply', reply => {
  //   console.log(`${reply}`)
  // })
  // bot.send('hi')
} else {
  module.exports = {
    init: initBot
  }
}
