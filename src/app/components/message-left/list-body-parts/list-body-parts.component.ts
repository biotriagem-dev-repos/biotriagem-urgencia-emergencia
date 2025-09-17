import { CommonModule } from '@angular/common'
import { Component, inject, input, signal } from '@angular/core'
import { iMessage } from '../../../interface/iMessage.interface'
import { iOption } from '../../../interface/iOption.interface'
import { MessageService } from '../../../services/message.service'

@Component({
  selector: 'app-list-body-parts',
  imports: [CommonModule],
  templateUrl: './list-body-parts.component.html',
  styleUrl: './list-body-parts.component.scss',
})
export class ListBodyPartsComponent {
  messageInput = input.required<iMessage>()
  showOption = signal<boolean>(false)

  private $messageService = inject(MessageService)

  sendUserMessage(selectedOption: iOption) {
    const messageInput = this.messageInput()

    messageInput.userResponseValue = selectedOption.resultMessage
    messageInput.next = selectedOption.next

    this.$messageService.sendNewUserMessage(messageInput)
    this.showOption.set(true)
  }
}
