import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  type OnInit,
} from '@angular/core'

import { CommonModule } from '@angular/common'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import {
  faFileMedicalAlt,
  faSyringe,
} from '@fortawesome/free-solid-svg-icons'
import { MessageService } from '../../services/message.service'

import { MatProgressBarModule } from '@angular/material/progress-bar'
import { GptServiceService } from '../../services/GptService.service'
import { ChatService } from '../../services/chat.service'

@Component({
  selector: 'app-final-result',
  imports: [FontAwesomeModule, CommonModule, MatProgressBarModule],
  templateUrl: './final-result.component.html',
  styleUrl: './final-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalResultComponent implements OnInit {
  faFileMedicalAlt = faFileMedicalAlt
  faSyringe = faSyringe

  resetChatEvent = output()
  private $gptServiceService = inject(GptServiceService)
  private $messageService = inject(MessageService)

  result_array: any[] = []
  diagnostic_array = signal<any[]>([])

  resultGPT = signal<any[]>([])

  loading = signal<boolean>(true)

  private $chatService = inject(ChatService)
  private currentSessionId: string | null = null

  ngOnInit(): void {
    const finalResult = this.$messageService.finalResult()

    finalResult.forEach((item: any) => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const values = item[key]['finalResult']

          if (values === undefined) {
            return
          }

          if (Array.isArray(values)) {
            const filteredValues = values.filter(
              (value) => value !== undefined && value !== null
            )
            this.result_array.push(...filteredValues)
          } else {
            this.result_array.push(values)
          }
        }
      }
    })

    const gptResponse =
      this.$gptServiceService.getGptResponse(finalResult)

    gptResponse.subscribe(async (result) => {
      if (result?.choices?.length > 0) {
        const responseMessage = result.choices[0].message.content
        // this.resultGPT.set(JSON.parse(responseMessage))
        this.resultGPT.set(responseMessage)
        this.loading.set(false)

        sessionStorage.setItem('completed', 'true')

        const currentSession =
          this.$chatService.getCurrentActiveSessionId()

        if (!currentSession) {
          console.error(
            'ChatComponent: Tentando enviar mensagem sem sessão ativa.'
          )
          return
        }

        await this.$chatService.addMessageToSession({
          sender: 'model',
          resultModel: responseMessage,
        })
      } else {
        console.error('Resposta inválida do GPT:', result)
      }
    })
  }

  reset() {
    console.log('1')
    this.result_array = []
    this.resultGPT.set([])
    this.resetChatEvent.emit()
  }
}
