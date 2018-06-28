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
  appPassword: process.env.MicrosoftAppPassword
})

server.post('/api/messages', connector.listen())

let bot = new builder.UniversalBot(connector, (session) => {
  session.send("You said: %s", session.message.text)
})

// https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0
// https://github.com/dmdnkv/skype-sdk
