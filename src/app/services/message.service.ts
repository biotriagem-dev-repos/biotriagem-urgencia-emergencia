import { Injectable, signal } from '@angular/core'
import { iMessage } from '../interface/iMessage.interface'

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  newUserMessage = signal<iMessage | null>(null)

  botVariables = signal<any[]>([])
  finalResult = signal<any[]>([])

  // Toda a conversa que o usuário respondeu
  allConversation = signal<iMessage[]>([])

  sendNewUserMessage(newUserMessage: iMessage): void {
    if (newUserMessage.userResponse) {
      switch (newUserMessage.type) {
        case 'form':
          newUserMessage.inputs?.forEach((input: any) => {
            if (input.variableName && input.userResponseValue) {
              this.criarObjeto(
                input.variableName,
                input.userResponseValue,
                input.finalResult
              )
            }
          })
          break

        case 'option':
          if (newUserMessage.multipleOptions) {
            const selectedOptions = newUserMessage.options?.filter(
              (option: any) => option.selected
            )

            if (selectedOptions && selectedOptions.length > 0) {
              const items: any[] = []
              const finalResults: any[] = []

              selectedOptions.forEach((item: any) => {
                if (item.subOption) {
                  const selectedSubOption = item.subOption.find(
                    (option: any) => option.selected
                  )

                  items.push(
                    item.text + ':' + selectedSubOption.value
                  )
                  finalResults.push(selectedSubOption.resultMessage)
                } else {
                  items.push(item.value)
                  finalResults.push(item.resultMessage)
                }
              })

              this.criarObjeto(
                newUserMessage.variableName!,
                items,
                finalResults
              )
            }
          } else {
            const selectedOption = newUserMessage.options?.find(
              (option: any) => option.selected
            )
            if (selectedOption) {
              if (selectedOption.subOption) {
                const selectedSubOption =
                  selectedOption.subOption.find(
                    (option: any) => option.selected
                  )
                this.criarObjeto(
                  newUserMessage.variableName!,
                  selectedOption.text + ':' + selectedSubOption.value,
                  selectedSubOption.resultMessage
                )
              } else {
                this.criarObjeto(
                  newUserMessage.variableName!,
                  selectedOption.value,
                  selectedOption.resultMessage
                )
              }
            }
          }
          break

        case 'avatar':
          if (newUserMessage.userResponseValue) {
            this.criarObjeto(
              newUserMessage.variableName!,
              newUserMessage.userResponseValue,
              newUserMessage.resultMessage
            )
          }
      }
    }

    this.newUserMessage.set({ ...newUserMessage })
  }

  criarObjeto(key: string, value: any, finalResult?: any) {
    const objeto: any = { value: value }

    if (finalResult !== undefined) {
      objeto.finalResult = finalResult
    }

    this.finalResult.update((currentFinal) => [
      ...currentFinal,
      { [key]: objeto },
    ])
  }

  updateAllConversation(message: iMessage) {
    this.allConversation.update((currentConversation) => [
      ...currentConversation,
      message,
    ])
  }
}
