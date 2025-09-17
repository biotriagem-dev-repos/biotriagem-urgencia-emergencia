import { CommonModule, isPlatformBrowser } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import {
  Component,
  effect,
  Inject,
  inject,
  PLATFORM_ID,
  signal,
  type OnInit,
} from '@angular/core'
import { parse } from 'jsonc-parser'
import { HeaderComponent } from '../../components/header/header.component'
import { LoadingMessageComponent } from '../../components/loadingMessage/loadingMessage.component'
import { MessageLeftComponent } from '../../components/message-left/message-left.component'
import { PrivacyPolicyComponent } from '../../components/privacyPolicy/privacyPolicy.component'
import { iChatBotConfiguration } from '../../interface/iChatBotConfiguration'
import { iFooter } from '../../interface/iFooter.interface'
import { iMessage } from '../../interface/iMessage.interface'
import { ChatService } from '../../services/chat.service'
import { LocalStoreService } from '../../services/local-store.service'
import { MessageService } from '../../services/message.service'

@Component({
  selector: 'app-chat-bot',
  imports: [
    HeaderComponent,
    MessageLeftComponent,
    PrivacyPolicyComponent,
    CommonModule,
    LoadingMessageComponent,
  ],
  templateUrl: './chatBot.component.html',
  styleUrl: './chatBot.component.scss',
  standalone: true,
})
export class ChatBotComponent implements OnInit {
  allConversation = signal<iMessage[]>([])
  botMessages = signal<[]>([])

  showPrivacyPolicy = signal<boolean>(false)
  currentStep = signal<string>('0')
  score: number = 0

  showFooter: iFooter = { readOnly: true, show: false, focus: false }

  chatBotConfiguration = signal<iChatBotConfiguration | null>(null)

  private http = inject(HttpClient)
  private $messageService = inject(MessageService)
  private $localStoreService = inject(LocalStoreService)
  private $chatService = inject(ChatService)

  private currentSessionId: string | null = null

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    effect(async () => {
      const newUserMessage = this.$messageService.newUserMessage()

      if (newUserMessage) {
        const currentSession =
          this.$chatService.getCurrentActiveSessionId()

        if (!currentSession) {
          console.error(
            'ChatComponent: Tentando enviar mensagem sem sessão ativa.'
          )
          return
        }

        await this.$chatService.addMessageToSession({
          sender: 'user',
          message: newUserMessage,
        })

        this.goToNextStep(newUserMessage)
      }

      const allConversation = this.$messageService.allConversation()

      if (allConversation) {
        console.log('allConversation', allConversation)
        this.allConversation.set(allConversation)
      }
    })
  }

  ngOnInit() {
    this.startConversation()
  }

  async startConversation() {
    console.log('Iniciando conversa...')
    try {
      this.currentSessionId =
        await this.$chatService.getActiveSessionIdOrInitialize()
      // Você pode querer carregar mensagens de uma sessão anterior se o ID for persistido
      // ou se você tiver uma lógica para retomar sessões.
      console.log(
        'Componente do Chat: Sessão iniciada com ID:',
        this.currentSessionId
      )
    } catch (error) {
      console.error(
        'Componente do Chat: Erro ao iniciar sessão',
        error
      )
      // Trate o erro apropriadamente (ex: mostrar uma mensagem para o usuário)
    }

    const privacyPolicy =
      this.$localStoreService.getItem('privacyPolicy')

    if (!privacyPolicy || privacyPolicy !== 'accepted') {
      this.showPrivacyPolicy.set(true)
      return
    }

    // this.$chatBotConfigurationService.createItemPOC()
    this.loadConversation()
  }

  ngAfterViewChecked() {
    this.scrollToMessage()
  }

  scrollToMessage() {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(this.currentStep())
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  loadConversation() {
    this.http
      .get('assets/conversation/conversation.jsonc', {
        responseType: 'text',
      })
      .subscribe({
        next: (textData) => {
          const chatBotConfiguration = parse(textData)

          this.chatBotConfiguration.set(chatBotConfiguration)
          this.botMessages.set(chatBotConfiguration.flow)

          const firstMessage: iMessage =
            chatBotConfiguration.flow[this.currentStep()]
          this.sendNewBotMessage(firstMessage)
        },
        error: (e) => {
          console.error('Erro ao carregar o JSONC:', e)
        },
      })
  }

  sendNewBotMessage(message: iMessage): void {
    this.$messageService.updateAllConversation(message)

    // Se userResponse === false, ele printa a mensagem e vai para próxima
    if (
      message.userResponse === false &&
      message.type !== 'final_result'
    )
      this.goToNextStep(message)
  }

  goToNextStep(message: iMessage): void {
    // Se não houver options definidas no message, use o next do message (caso exista)
    // Se não houver next, encerre o fluxo
    if ((!message.options || !message.inputs) && message.next) {
      if (message.next) {
        this.goToStepById(message.next)
      }
    } else {
      // Se houver options e essas options não tiverem subOptions, use o next da option selecionada
      const selectedOption = message.options?.find(
        (option) => option.selected && option.subOption === undefined
      )
      if (selectedOption) {
        this.goToStepById(selectedOption.next)
      } else {
        // Se houver options e essas options tiverem subOptions, use o next da subOption selecionada
        const selectedSubOption = message.options?.find(
          (option) =>
            option.selected &&
            option.subOption?.some((sub: any) => sub.selected)
        )

        if (selectedSubOption) {
          // Se houver subOptions selecionadas, use o next da subOption selecionada
          const selectedSubOptionSelected =
            selectedSubOption.subOption?.find(
              (subOption) => subOption.selected
            )

          if (selectedSubOptionSelected) {
            this.goToStepById(selectedSubOptionSelected.next)
          }
        }
      }
    }
  }

  // Muda o passo atual para o ID especificado, se existir.
  goToStepById(stepId: string | undefined): void {
    // Se o ID for indefinido, encerre o fluxo
    if (!stepId) {
      // this.restartConversation(
      //   'A conversa foi encerrada. Obrigado por usar o chatbot.'
      // )
      return
    }

    // Busca o próximo passo
    const next = this.botMessages().find(
      (step: any) => step.id === stepId
    )

    // Se o próximo passo existir, atualize o passo atual e envie a mensagem
    // Se não existir, envie uma mensagem de erro.
    if (!next) {
      // TODO: VALIDAR ERROR
      console.log(
        `Ops. O ID "${stepId}" não foi encontrado no fluxo.`
      )
      return
    }

    this.currentStep.set(stepId.toString())
    this.sendNewBotMessage(next)
  }

  privacyPolicyAccepted(disable: boolean) {
    // Se disable for true, então o usuário aceitou o termo de privacidade.
    // Então setamos false para showPrivacyPolicy
    this.showPrivacyPolicy.set(!disable)
    this.loadConversation()
  }

  reset() {
    console.log('Reiniciando conversa...')
    this.currentStep.set('0')
    this.allConversation.set([])
    this.botMessages.set([])
    this.$localStoreService.setItem('privacyPolicy', 'accepted')
    this.$messageService.allConversation.set([])
    this.$messageService.finalResult.set([])
    this.$messageService.botVariables.set([])
    this.$messageService.newUserMessage.set(null)
    this.$chatService.resetSessionInitializationPromise()
    this.startConversation()
  }
}
