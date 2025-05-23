import env from '#start/env'

import { DiscordOptions } from '#types/config/discord'

const socketConfig = {
  token: env.get('DISCORD_TOKEN', ''),
  clientId: env.get('DISCORD_CLIENT_ID', ''),
} satisfies DiscordOptions

export default socketConfig
