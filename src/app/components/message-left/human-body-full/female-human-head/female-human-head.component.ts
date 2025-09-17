import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core'
import { iMessage } from '../../../../interface/iMessage.interface'
import { MessageService } from '../../../../services/message.service'

@Component({
  selector: 'app-female-human-head',
  imports: [CommonModule],
  templateUrl: './female-human-head.component.html',
  styleUrl: './female-human-head.component.scss',
})
export class FemaleHumanHeadComponent {
  messageInput = input.required<iMessage>()
  disableSVG = output<boolean>()

  private $messageService = inject(MessageService)

  @ViewChild('womanHeadSvg') womanHeadSvg!: ElementRef<SVGElement>
  public viewBox = '0 0 500 500'

  sendUserMessage(message: string) {
    const messageInput = this.messageInput()
    messageInput.userResponseValue = message
    this.$messageService.sendNewUserMessage(messageInput)
    this.disableSVG.emit(true)
  }
}
