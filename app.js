const builder = require('botbuilder')
const restify = require('restify')

require('dotenv').config()

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

let bot = new builder.UniversalBot(connector, (session) => {
  console.log(session.dialogStack(), session.message.text)
  if (session.message.text) {
    session.send("Root dialog. You said: %s", session.message.text)
  } else {
    session.send("Root dialog.")
  }
})

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded && message.membersAdded.length > 0) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/')
            }
        });
    }
})

// bot.dialog('/', [
//   (session) => {
//     session.send('root dialog')
//   }
// ])

// bot.dialog('root', [
//   (session) => {
//     session.send('root dialog')
//   }
// ])

bot.dialog('level0-a', [
  (session) => {
    console.log(session.dialogStack(), session.message.text)
    session.send('level0 A dialog')
  }
]).triggerAction({
   matches: /^level0-a$/i
})

// https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0
// https://github.com/dmdnkv/skype-sdk
