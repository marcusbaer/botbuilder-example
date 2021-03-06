const BotLib = require('./lib/bot')

const bot = BotLib.bot
const addBotMlDialog = BotLib.addBotMlDialog
const createBotMlRootDialog = BotLib.createBotMlRootDialog
const cardActions = BotLib.cardActions

//createBotMlRootDialog('/', ['welcome.bot', 'dictionaries.bot'])

bot.dialog('/', [
  (session) => {
    // console.log('/',session.dialogStack(), session.message.text)
    if (session.message.text) {
      session.send("Root dialog. You said: %s", session.message.text)
    } else {
      session.send("Root dialog.")
      let msg = cardActions(
        session,
        'Make a decision!',
        [
          { dialog: 'level0-a', label: 'Option A: with end'},
          { dialog: 'level0-b', label: 'Option B: no end'},
          { dialog: 'level0-c', label: 'Option C: waterfall'},
          { dialog: 'info', label: 'user info'},
        ]
      )
      session.send(msg)
    }
  },
  (session) => {
    session.replaceDialog('/')
  }
])

addBotMlDialog('Smalltalk', ['smalltalk.bot', 'dictionaries.bot'], /^hi$/i)
