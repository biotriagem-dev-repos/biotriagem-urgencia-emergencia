import { CommonModule } from '@angular/common'
import { Component, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { iMessage } from '../../interface/iMessage.interface'
import { VariablePipe } from '../../pipe/variable.pipe'
import { FinalResultComponent } from '../final-result/final-result.component'
import { FormComponent } from './form/form.component'
import { HumanBodyFullComponent } from './human-body-full/human-body-full.component'
import { ListBodyPartsComponent } from './list-body-parts/list-body-parts.component'
import { OptionsComponent } from './options/options.component'

@Component({
  selector: 'app-message-left',
  imports: [
    CommonModule,
    HumanBodyFullComponent,
    FormComponent,
    OptionsComponent,
    VariablePipe,
    FormsModule,
    FinalResultComponent,
    ListBodyPartsComponent,
  ],
  templateUrl: './message-left.component.html',
  styleUrl: './message-left.component.scss',
  standalone: true,
})
export class MessageLeftComponent {
  messageInput = input.required<iMessage>()
  resetChatEvent = output()

  reset() {
    console.log('2')
    this.resetChatEvent.emit()
  }
}
