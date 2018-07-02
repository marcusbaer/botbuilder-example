# Bot builder example

Demonstration of a basic bot setup with BotBuider in combination with BotML to handle a dialog flow.

# Usage

    npm install
    npm start

# Testing

Inspect bot with Bot Explorer.

# How to do bots

What is the main purpose of your bot?

- get into contact with users
- make purchase
- offer advice
- ...

Which key information is required to fulfil the purpose or to offer advice?

Which dialogs are required to get these information?

- asking dialogs (asking for key information ... country, email etc.)
- identification dialogs (indentifing key information within dialogs ... e.g. with LUIS)
- suggesting dialogs (suggest other dialogs based on collected user key information data)

Have a root dialog.

Let "not understand"-dialog end the dialog and reset to root dialog.

Be sure to lead the user with your dialogs to control the dialogs by yourself.

Auto-detect key information (if possible by other information, e.g. regional groups by country).

Are there useful yes/no-tracks?

Remember visited dialogs and user data.

# TODO

- add Dockerfile
- add local web chat and skype example
- deployment
- if user leaves the bot, destroy his botmlUserDialogs

# More

- https://codename.co/botml/
- https://docs.microsoft.com/en-us/azure/bot-service/nodejs/bot-builder-nodejs-quickstart?view=azure-bot-service-3.0
- https://github.com/dmdnkv/skype-sdk
