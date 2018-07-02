const BotLib = require('./lib/bot')

const bot = BotLib.bot
const addBotMlDialog = BotLib.addBotMlDialog

/*
bot.dialog('BotML', [
  botmlDialog([
    'dialogs/smalltalk.bot'
  ])
]).triggerAction({
   matches: /^hi$/i
})
*/

addBotMlDialog('Smalltalk', ['smalltalk.bot'], /^hi$/i)

bot.dialog('level0-a', [
  (session) => {
    console.log('level0-a', session.dialogStack(), session.message.text)
    session.send('level0 A dialog. dialog ended.')
    session.endDialog()
  }
]).triggerAction({
   matches: /^level0-a$/i
})

bot.dialog('level0-b', [
  (session) => {
    console.log('level0-b:1', session.dialogStack(), session.message.text)
    session.send('level0 B:1 dialog. dialog without end.')
  }
]).triggerAction({
   matches: /^level0-b$/i
})

// TODO: add Dockerfile
// TODO: add local web chat and skype example
// TODO: deploy with Now.sh
// TODO: if user leaves the bot, destroy his botmlUserDialogs

bot.dialog('level0-c', [
  (session) => {
    session.send('level0 C:1 dialog. dialog with waterfall.')
    // TODO: implement waterfall with prompts here
  }
]).triggerAction({
   matches: /^level0-c$/i
})
/*
bot.dialog('info', [
  (session) => {
    session.send('info dialog. Channel: %s, language: %s', session.channelId, session.locale)
    console.log('level0-b:1', session.dialogStack(), session.message.text)
  }
]).triggerAction({
   matches: /^info/i
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
*/

/* FURTHER READING */

// https://codename.co/botml/
// https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0
// https://github.com/dmdnkv/skype-sdk
