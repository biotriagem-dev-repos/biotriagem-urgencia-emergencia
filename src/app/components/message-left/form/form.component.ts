import { CommonModule } from '@angular/common'
import {
  Component,
  inject,
  input,
  signal,
  type OnInit,
} from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { iMessage } from '../../../interface/iMessage.interface'
import { VariablePipe } from '../../../pipe/variable.pipe'
import { MessageService } from '../../../services/message.service'

@Component({
  selector: 'app-form',
  imports: [
    VariablePipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [provideNgxMask()],
})
export class FormComponent implements OnInit {
  messageInput = input.required<iMessage>()

  private $messageService = inject(MessageService)

  formGroup: FormGroup
  disableButton = signal<boolean>(false)

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({})
  }

  ngOnInit(): void {
    this.createForm()
  }

  createForm(): void {
    if (this.messageInput().inputs) {
      this.messageInput().inputs?.forEach((item: any) => {
        this.formGroup.addControl(
          item.variableName,
          new FormControl(
            { value: '', disabled: false },
            item.required
              ? Validators.required
              : Validators.nullValidator
          )
        )
      })
    } else {
      console.log('error')
    }
  }

  setReadonly() {
    this.disableButton.set(true)

    for (const controlName in this.formGroup.controls) {
      this.formGroup.controls[controlName].disable()
    }
  }

  submit() {
    this.setReadonly()

    const formValue = this.formGroup.value

    this.messageInput().inputs?.forEach((item: any) => {
      if (formValue.hasOwnProperty(item.variableName)) {
        item.userResponseValue = formValue[item.variableName]

        // Para o campo de radio, se o valor no formulario corresponder
        // com o valor de alguma option, entao marcar selected como true.
        if (item.type === 'radio' && item.options) {
          item.subOption.forEach((option: any) => {
            if (option.value === formValue[item.variableName]) {
              option.selected = true
            }
          })
        }
      }
    })

    this.$messageService.sendNewUserMessage(this.messageInput())
  }
}
