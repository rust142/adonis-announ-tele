import app from '@adonisjs/core/services/app'

import { Client, GatewayIntentBits, Message, Partials, REST, Routes } from 'discord.js'

import discordCommands from '#utils/discord/collections/discord_commands'
import HealthCheckCommand from '#utils/discord/commands/health_check'
import TelegramService from './telegram_service.js'
import { inject } from '@adonisjs/core'

@inject()
class DiscordService {
  constructor(protected telegramService: TelegramService) {}

  protected rest = new REST({ version: '10' }).setToken(app.config.get('discord.token'))

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds, // izinkan bot berinteraksi di guild
      GatewayIntentBits.GuildMembers, // izinkan bot berinteraksi dengan member di guild
      GatewayIntentBits.GuildMessages, // izinkan bot membaca dan mengirim pesan di guild
      GatewayIntentBits.MessageContent, // izinkan bot membaca dan mengirim pesan ke user
      GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.GuildMember],
  })

  async connect() {
    try {
      this.client.on('ready', () => {
        console.log('Bot is Ready!')
        console.log('Code by .Rust')
        console.log(`Logged in as ${this.client.user?.tag}!`)
      })

      this.client.login(app.config.get('discord.token'))

      await this.appCommands()

      this.interactions()
      this.handleMessages()
    } catch (error) {
      console.error(error)
    }
  }

  async appCommands() {
    try {
      console.log('Started refreshing application (/) commands.')

      await this.rest.put(Routes.applicationCommands(app.config.get('discord.clientId')), {
        body: discordCommands,
      })

      console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  }

  protected interactions() {
    try {
      this.client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        if (interaction.commandName === 'ping') {
          console.log('interaction: ', interaction)
          await interaction.reply('Pong!')
        }

        if (interaction.commandName === 'server-info') {
          console.log('interaction: ', interaction)
          await interaction.reply('Server info!')
        }

        if (interaction.commandName === 'health-check') HealthCheckCommand.index(interaction)
      })
    } catch (error) {
      console.error(error)
    }
  }

  protected handleMessages() {
    try {
      const allowedChannelIds = [
        '1232278750901702727', // ganti dengan ID channel Discord kamu
        '1375435540861554718',
        // bisa tambah lagi
      ];

      this.client.on('messageCreate', async (message: Message) => {
        if (message.author.bot) return // abaikan pesan dari bot

        // Cek apakah pesan berasal dari salah satu channel yang diizinkan
        if (!allowedChannelIds.includes(message.channelId)) return;

        console.log(`Pesan dari ${message.author.username} di channel Adonis Announcement: ${message.content}`)

        const cleanText = this.cleanDiscordMessage(message)
        this.telegramService.sendToTelegram(cleanText)
      })
    } catch (error) {
      console.error(error)
    }
  }

  protected cleanDiscordMessage(message: Message): string {
    let text = message.content

    text = text.replace(/<:\w+:\d+>/g, '')

    // Hilangkan <> di sekitar URL seperti <https://blabla>
    text = text.replace(/<((https?:\/\/)[^>]+)>/g, '$1')

    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '$1')
    // Italic: *text* atau _text_
    text = text.replace(/(\*|_)(.*?)\1/g, '$2')
    // Underline: __text__
    text = text.replace(/__(.*?)__/g, '$1')
    // Strike: ~~text~~
    text = text.replace(/~~(.*?)~~/g, '$1')
    // Inline code: `code`
    text = text.replace(/`(.*?)`/g, '$1')
    // Code block: ```code```
    text = text.replace(/```[\s\S]*?```/g, '')
    // Spoiler: ||text||
    text = text.replace(/\|\|(.*?)\|\|/g, '$1')

    return text
  }
}

const discord = await app.container.make(DiscordService)

await app.container.call(discord, 'connect')

export default DiscordService
