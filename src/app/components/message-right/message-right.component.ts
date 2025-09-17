import { Component, input, type OnInit } from '@angular/core'
import { iMessage } from '../../interface/iMessage.interface'

@Component({
  selector: 'app-message-right',
  imports: [],
  templateUrl: './message-right.component.html',
  styleUrl: './message-right.component.scss',
  standalone: true,
})
export class MessageRightComponent implements OnInit {
  messageInput = input.required<iMessage>()

  ngOnInit(): void {}
}
