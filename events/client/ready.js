const { Bot } = require('../../structures/client')
const Discord = require('discord.js')

module.exports = {
    name: 'ready',

    /**
     * 
     * @param {Bot} client 
     */
    run: async (client) => {
        print(`${client.user.tag} connecté`)
        client.guilds.cache.forEach(async guild => {
            await guild.members.fetch().catch(e => { })
        })
        await client.users.fetch().catch(e => { })
    }
}