import { CommonModule } from '@angular/common'
import { Component, inject, input, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { iMessage } from '../../../interface/iMessage.interface'
import { iOption } from '../../../interface/iOption.interface'
import { MessageService } from '../../../services/message.service'

@Component({
  selector: 'app-options',
  imports: [FormsModule, CommonModule],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  messageInput = input.required<iMessage>()
  showButton = signal<boolean>(false)

  private $messageService = inject(MessageService)

  getBackgroundColor(rating: iOption) {
    return `rgba(${rating.color})`
  }

  sendNewUserMessage(selectedOption: iOption): void {
    if (selectedOption.clearOtherOptions) {
      this.messageInput().options?.forEach((option: any) => {
        if (option.clearOtherOptions) return
        option.selected = false

        if (option.subOption) {
          option.subOption.forEach(
            (subOption: any) => (subOption.selected = false)
          )
        }
      })
    }

    if (this.messageInput().multipleOptions) {
      // Se multipleOptions for true, permite múltiplas seleções
      selectedOption.selected = !selectedOption.selected
      this.showButton.set(true)

      if (selectedOption.subOption) {
        // Se for um subitem, desmarca os outros subitens do mesmo item principal
        this.messageInput().options?.forEach((option: any) => {
          if (
            option.subOption &&
            option.subOption.includes(selectedOption)
          ) {
            option.subOption.forEach((subOption: any) => {
              subOption.selected = subOption === selectedOption
            })
          }

          if (option.clearOtherOptions) {
            option.selected = false
          }
        })
      } else {
        this.messageInput().options?.forEach((option: any) => {
          if (
            option.subOption &&
            option.subOption.includes(selectedOption)
          ) {
            option.subOption.forEach((subOption: any) => {
              subOption.selected = subOption === selectedOption
            })
          }
        })
      }
    } else {
      // Se multipleOptions for false, permite apenas uma seleção
      this.messageInput().options?.forEach((option: any) => {
        if (selectedOption.subOption) {
          option.selected = option === selectedOption
        } else {
          // Gerencia a seleção de subitens dentro do item principal selecionado
          if (
            option.subOption &&
            option.subOption.includes(selectedOption)
          ) {
            option.subOption.forEach((subOption: any) => {
              subOption.selected = subOption === selectedOption
            })
          } else {
            option.selected = option === selectedOption
          }
        }
      })
    }

    const multipleOption = this.messageInput().multipleOptions
    this.sendSelectedOptions(multipleOption)
  }

  sendSelectedOptions(multipleOption: boolean = true) {
    // Se multipleOption igual a TRUE é porque o usuário ainda está selecionando as opções
    // Para não enviar de forma automática igual multipleOption igual a false
    // Quando essa função sendSelectedOptions for chamada pelo botão enviar, quer dizer que o usuário já selecionou todas e ele mesmo enviou
    if (multipleOption) return

    let messageArray: string[] = []

    this.messageInput().options?.forEach((option: any) => {
      if (option.selected) {
        if (option.subOption) {
          // Verifica se todas as subopções estão desmarcadas
          const subOptionSelected = option.subOption.every(
            (subOption: any) => !subOption.selected
          )

          // Se todas as subopções estiverem desmarcadas, desabilitar o footer
          if (subOptionSelected) {
            this.showButton.set(false)
            return
          }

          option.subOption.forEach((subOption: any) => {
            if (subOption.selected) {
              messageArray.push(`${option.text}: ${subOption.text}`)
            }
          })
        } else {
          messageArray.push(option.text)
        }
      }
    })

    if (messageArray.length === 0) return

    this.$messageService.sendNewUserMessage(this.messageInput())

    // Depois de enviar a mensagem, desmarcar todas as opções e remover botão enviar
    this.setReadOnlyToAllOptions(true)
  }

  setReadOnlyToAllOptions(readOnly: boolean) {
    this.showButton.set(false)
    this.messageInput().options?.forEach((option: any) => {
      option.disabled = readOnly
      if (option.selected) {
        if (option.subOption) {
          option.subOption.forEach((subOption: any) => {
            subOption.disabled = readOnly
          })
        }
      }
    })
  }
}
