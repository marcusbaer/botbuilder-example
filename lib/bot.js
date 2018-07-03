require('dotenv').config()

const BotML = require('botml')
const builder = require('botbuilder')
const restify = require('restify')

let botmlUserDialogs = {}

const cardActions = (session, text = 'Choose an option!', options = []) => {

  let cardActionsList = options.map(option => {
    return builder.CardAction.imBack(session, option.dialog, option.label)
  })

  let msg = new builder.Message(session)
    .text(text)
    .suggestedActions(builder.SuggestedActions.create(session, cardActionsList))
  return msg
}

const botmlDialog = (dialogMarkup) => {
  return (session, args, next) => {
    console.log('BotML', session.message.text)
    let locale = session.locale || 'de'
    // init botml dialogs
    if (!botmlUserDialogs[session.id]) {
      dialogMarkup = dialogMarkup.map(filename => `dialogs/${locale}/${filename}`)
      let dialogs = new BotML(dialogMarkup)
      // dialogs.on('*', response => {
      //   console.log(response)
      // })
      dialogs.on('variable:set', (key, value) => {
        if (key.match(/^([a-zA-Z]+)$/)) {
          session.privateConversationData[key] = value
        }
      })
      dialogs.on('reply', reply => {
        session.send(`${reply}`)
//        session.send(`BotML: ${reply}`)
      })
      dialogs.on('quit-handson', reply => {
        session.replaceDialog('suggestHandsOnTopic')
      })
      dialogs.on('quit', reply => {
        session.endDialog()
      })
      botmlUserDialogs[session.id] = dialogs
    }

    botmlUserDialogs[session.id].send(session.message.text)
  }
}

const addBotMlDialog = (dialogId, dialogMarkup, dialogTrigger) => {
  bot.dialog(dialogId, [
    botmlDialog(dialogMarkup)
  ]).triggerAction({
     matches: dialogTrigger // /^hi$/i
  })
}

const createBotMlRootDialog = (dialogId, dialogMarkup) => {
  bot.dialog(dialogId, [
    botmlDialog(dialogMarkup),
    (session) => {
      session.replaceDialog('/')
    }
  ])
}

// Setup Restify Server
let server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url)
})

// Create chat connector for communicating with the Bot Framework Service
//let connector = new builder.ConsoleConnector().listen()
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

/*
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
*/
/*
bot.dialog('BotML', [
  botmlDialog([
    'dialogs/smalltalk.bot'
  ])
]).triggerAction({
   matches: /^hi$/i
})
*/

bot.dialog('userDataInfo', [
  (session, args, next) => {
    console.log('userDataInfo', session.message.text)

    // TODO: evaluate session.userData
    session.send(`Oh, you wanna see everything, that I know about you.`)

    let dataInfo = []
    let msg = new builder.Message(session)
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    let cards = []
    for (let key in session.privateConversationData) {
      let value = session.privateConversationData[key]
      dataInfo.push(`Your ${key} is ${value}.`)
      cards.push(new builder.HeroCard(session).title(`${key.toUpperCase()}`).text(`Your ${key} is ${value}.`))
    }

    if (dataInfo.length > 0) {
      session.send(dataInfo.join(' '))
    } else {
      session.send(`I don't know anything about you. Wanna tell me something more? Then start a smalltalk by saying 'Hi'.`)
    }

    if (cards.length > 0) {
      msg.attachments(cards)
      session.endDialog(msg)
    } else {
      session.endDialog()
    }
  }
]).triggerAction({
   matches: /^info$/i
})

bot.dialog('reset', [
  (session) => {
    session.send('reset dialog.')
    session.endDialog()
    session.replaceDialog('/')
  }
]).triggerAction({
   matches: /^reset$/i
})

module.exports = {
  bot: bot,
  server: server,
  createBotMlRootDialog: createBotMlRootDialog,
  addBotMlDialog: addBotMlDialog,
  cardActions: cardActions
}

/* FURTHER READING */

// https://codename.co/botml/
// https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0
// https://github.com/dmdnkv/skype-sdk
