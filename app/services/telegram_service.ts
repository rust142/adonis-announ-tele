import app from '@adonisjs/core/services/app'
import axios from 'axios'

class TelegramService {
  async sendToTelegram(message: string) {
    const telegramToken = app.config.get('telegram.token') // simpan token di .env
    const telegramChatId = app.config.get('telegram.chatId') // ID target (grup/user)

    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`

    try {
      await axios.post(url, {
        chat_id: telegramChatId,
        text: message,
      })
      console.log('Berhasil kirim ke Telegram')
    } catch (error) {
      console.error('Gagal kirim ke Telegram:', error)
    }
  }
}

export default TelegramService
