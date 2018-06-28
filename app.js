const builder = require('botbuilder')
const restify = require('restify')

require('dotenv').config()

const cardActions = (session, text = 'Choose an option!', options = []) => {

  let cardActionsList = options.map(option => {
    return builder.CardAction.imBack(session, option.dialog, option.label)
  })

  let msg = new builder.Message(session)
    .text("Make a decision!")
    .suggestedActions(builder.SuggestedActions.create(session, cardActionsList))
  return msg
}

// Setup Restify Server
let server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat connector for communicating with the Bot Framework Service
// let connector = new builder.ConsoleConnector().listen()
let connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  openIdMetadata: process.env.BotOpenIdMetadata
})

server.post('/api/messages', connector.listen())

let bot = new builder.UniversalBot(connector)

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/')
            }
        });
    }
})

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
          { dialog: 'level0-a', label: 'Option A'},
          { dialog: 'level0-b', label: 'Option B'},
        ]
      )
      session.send(msg)
    }
  },
  (session) => {
    session.replaceDialog('/')
  }
])

bot.dialog('level0-a', [
  (session) => {
    console.log('level0-a', session.dialogStack(), session.message.text)
    session.send('level0 A dialog')
  }
]).triggerAction({
   matches: /^level0-a$/i
})

bot.dialog('level0-b', [
  (session) => {
    console.log('level0-b', session.dialogStack(), session.message.text)
    session.send('level0 B dialog')
  }
]).triggerAction({
   matches: /^level0-b$/i
})

// https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0
// https://github.com/dmdnkv/skype-sdk
