import {
  ActionRowBuilder,
  CacheType,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

import Formatter from '#utils/formatter'

import axios from 'axios'

class HealthCheckCommand {
  static async index(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      const modal = new ModalBuilder().setCustomId('modalHealthCheck').setTitle('Health Check')

      const messageInput = new TextInputBuilder()
        .setCustomId('messageInput')
        .setLabel('url api')
        .setPlaceholder('http://localhost:1234/health')
        .setValue('http://localhost:1234/health')
        .setRequired()
        .setStyle(TextInputStyle.Short)

      modal.addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput)
      )

      await interaction.showModal(modal)

      const modalResponse = await interaction.awaitModalSubmit({
        filter: (i) => i.customId === 'modalHealthCheck' && i.user.id === interaction.user.id,
        time: 60000,
      })

      if (modalResponse.isModalSubmit()) {
        const urlMsg = modalResponse.fields.getTextInputValue('messageInput')
        console.log(urlMsg)

        const guild = modalResponse.guild
        if (!guild) return

        await modalResponse.deferReply({
          ephemeral: true,
        })

        if (modalResponse.customId === 'modalHealthCheck') {
          const channel = modalResponse.client.channels.cache.get(modalResponse.channelId!)

          const result = await axios.get(urlMsg)

          const markdown = Formatter.objectToMarkdown(result.data)

          if (channel && channel.type === ChannelType.GuildText) {
            const embed = new EmbedBuilder()
              .setColor('#0099ff')
              .setTitle('🍃 **Health Check**')
              // .setImage(config.image)
              .setDescription(markdown)

            await channel.send({
              embeds: [embed],
            })

            await modalResponse.deleteReply()
          }
        }
      }
    } catch (err) {
      console.error('Error:', err.message)
    }
  }
}

export default HealthCheckCommand
