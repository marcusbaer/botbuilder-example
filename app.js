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
    session.send("Ich kann dir was über das Hand-On zu Chatbots erzählen.")
    let msg = cardActions(
      session,
      'Worüber möchtest du mehr wissen?',
      [
        { dialog: 'Hands-On im Überblick', label: 'Überblick'},
        { dialog: 'Hands-On zu Cognitive Services', label: 'Cognitive Services'},
        { dialog: 'Hands-On zu LUIS', label: 'LUIS'},
        { dialog: 'Hands-On zu QnA Maker', label: 'QnA Maker'},
        { dialog: 'Hands-On zu Cards', label: 'Cards'},
      ]
    )
    session.send(msg)
  }
]).triggerAction({
   matches: /vorschlag/i
})

// currently only the same dialog definition for each item works...
addBotMlDialog('askForName', ['hands-on.bot'], /(name|heißt)/i)
addBotMlDialog('showHandsOnRoot', ['hands-on.bot'], /^hi$/i)
addBotMlDialog('showHandsOnCognitiveServices', ['hands-on.bot'], /^Hands-On /i)
