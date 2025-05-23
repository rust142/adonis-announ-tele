import DiscordService from '#service/discord'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    connect: DiscordService
  }
}
