import env from '#start/env'

import { TelegramOptions } from '#types/config/telegram'

const telegramConfig = {
  token: env.get('TELEGRAM_TOKEN', ''),
  chatId: env.get('TELEGRAM_CHAT_ID', ''),
} satisfies TelegramOptions

export default telegramConfig
