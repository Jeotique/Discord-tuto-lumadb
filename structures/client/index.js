const {Client, Intents} = require('discord.js')
const {Collection, print, sleep} = require('mxtorie-utils')
const fs = require('fs')
class Bot extends Client {
    constructor(options = {
        restTimeOffset: 1,
        intents: [Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING],
        partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER", "MEMBER"]
    }) {
        super(options)
        this.setMaxListeners(15)
        this.config = require('../../config')
        this.commands = new Collection()
        this.aliases = new Collection()
        this.initCommands()
        this.initEvents()
        this.login(this.config.token)
    }

    initCommands(){
        const subFolders = fs.readdirSync('./commands')
        for(const category of subFolders){
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for(const commandFile of commandsFiles){
                const command = require(`../../commands/${category}/${commandFile}`)
                command.category = category
                command.commandFile = commandFile
                this.commands.set(command.name, command)
                if(command.aliases && command.aliases.length > 0){
                    command.aliases.forEach(alias => this.aliases.set(alias, command))
                }
            }
        }
    }

    initEvents(){
        const subFolders = fs.readdirSync('./events')
        for(const category of subFolders){
            const eventsFiles = fs.readdirSync(`./events/${category}`).filter(file => file.endsWith('.js'))
            for(const eventFile of eventsFiles){
                const event = require(`../../events/${category}/${eventFile}`)
                this.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }
}

exports.Bot = Bot