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
      session.send("Ich verstehe nicht den Zusammenhang. '%s' sagt mir nix.", session.message.text)
    } else {
      session.send("Hallo!")
    }
  },
  (session) => {
    session.replaceDialog('/')
  }
])

bot.dialog('suggestHandsOnTopic', [
  (session) => {
    // console.log('/',session.dialogStack(), session.message.text)
    let msg = cardActions(
      session,
      'Worüber möchtest du mehr wissen?',
      [
        { dialog: 'mehr über Aufbau', label: 'Aufbau'}, // mba
        { dialog: 'mehr über Cognitive Services', label: 'Cognitive Services'}, // mvg
        { dialog: 'mehr über LUIS', label: 'LUIS'}, // mvg
        { dialog: 'mehr über QnA Maker', label: 'QnA Maker'}, // mvg
        { dialog: 'mehr über Tipps', label: 'Tipps'}, // mba
        { dialog: 'mehr über Cards', label: 'Cards'}, // mvg
        { dialog: 'mehr über Fazit', label: 'Fazit'}, // mba
      ]
    )
    session.send(msg)
  }
]).triggerAction({
   matches: /vorschlag/i
})

bot.dialog('quitHandsOnTopicSuggest', [
  (session) => {
    // console.log('/',session.dialogStack(), session.message.text)
    session.send('Ok.')
    session.endDialog()

  }
]).triggerAction({
   matches: /tschüs/i
})

bot.dialog('quitHandsOnTopic', [
  (session) => {
    // console.log('/',session.dialogStack(), session.message.text)
    session.send('Ok.')
    session.beginDialog('suggestHandsOnTopic')
  }
]).triggerAction({
   matches: /genug/i
})

// currently only the same dialog definition for each item works...
addBotMlDialog('askForName', ['hands-on.bot'], /(name|heißt)/i)
addBotMlDialog('showHandsOnRoot', ['hands-on.bot'], /^hi$/i)
addBotMlDialog('showHandsOnTopic', ['hands-on.bot'], /^mehr über /i)
