import { iMessage } from './iMessage.interface'

export interface iChatBotConfiguration {
  title: string
  description: string
  flow: Array<iMessage>
  rules: any
  layout: {
    colorHeader: string
    colorText: string
  }
  timestamp?: Date
}
