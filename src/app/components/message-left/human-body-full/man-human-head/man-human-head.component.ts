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
  selector: 'app-man-human-head',
  imports: [CommonModule],
  templateUrl: './man-human-head.component.html',
  styleUrl: './man-human-head.component.scss',
})
export class ManHumanHeadComponent {
  messageInput = input.required<iMessage>()
  disableSVG = output<boolean>()

  private $messageService = inject(MessageService)

  @ViewChild('manHeadSvg') manHeadSvg!: ElementRef<SVGElement>
  public viewBox = '0 0 500 530'

  sendUserMessage(message: string) {
    const messageInput = this.messageInput()
    messageInput.userResponseValue = message
    this.$messageService.sendNewUserMessage(messageInput)
    this.disableSVG.emit(true)
  }
}
