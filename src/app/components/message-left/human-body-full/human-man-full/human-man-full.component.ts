import { CommonModule } from '@angular/common'
import {
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core'
import { iMessage } from '../../../../interface/iMessage.interface'
import { MessageService } from '../../../../services/message.service'

enum SexoUsuario {
  Feminino = 'Feminino',
  Masculino = 'Masculino',
}

@Component({
  selector: 'app-human-man-full',
  imports: [CommonModule],
  templateUrl: './human-man-full.component.html',
  styleUrl: './human-man-full.component.scss',
  standalone: true,
})
export class HumanManFullComponent {
  selectedParts: { [key: string]: boolean } = {}
  disable = signal<boolean>(false)

  messageInput = input.required<iMessage>()
  disableSVG = output<boolean>()

  private $messageService = inject(MessageService)

  @ViewChild('manSvg') manSvg!: ElementRef<SVGElement>
  public viewBox = '0 0 218 500'

  humanSex = signal<string>('Masculino')

  ngOnInit(): void {
    const variable = this.obterSexoUsuario(
      this.$messageService.botVariables()
    )

    if (variable) {
      this.humanSex.set(variable)
    }
  }

  obterSexoUsuario(dicionario: any): string | undefined {
    if (
      dicionario &&
      dicionario.sexoUsuario &&
      dicionario.sexoUsuario.value
    ) {
      return dicionario.sexoUsuario.value
    }
    return undefined
  }

  sendUserMessage(message: string) {
    const mapeamento: {
      [key: string]: { [key in SexoUsuario]: string }
    } = {
      Cabeça: {
        [SexoUsuario.Feminino]: 'cabecaFeminina',
        [SexoUsuario.Masculino]: 'cabecaMasculina',
      },
      Barriga: {
        [SexoUsuario.Feminino]: 'barrigaFeminina',
        [SexoUsuario.Masculino]: 'barrigaMasculina',
      },
      BracoEsquerdo: {
        [SexoUsuario.Feminino]: 'bracoEsq1',
        [SexoUsuario.Masculino]: 'bracoEsq1',
      },
      BracoDireito: {
        [SexoUsuario.Feminino]: 'bracoDir1',
        [SexoUsuario.Masculino]: 'bracoDir1',
      },
      PernaEsquerda: {
        [SexoUsuario.Feminino]: 'pernaEsq1',
        [SexoUsuario.Masculino]: 'pernaEsq1',
      },
      PernaDireita: {
        [SexoUsuario.Feminino]: 'pernaDir1',
        [SexoUsuario.Masculino]: 'pernaDir1',
      },
      Peito: {
        [SexoUsuario.Feminino]: 'peitoFeminino',
        [SexoUsuario.Masculino]: 'peitoMasculino',
      },
      // ... outros mapeamentos ...
    }

    this.selectedParts[message] = true

    // Se desejar, pode deselecionar outras partes:
    Object.keys(this.selectedParts).forEach((key) => {
      if (key !== message) {
        this.selectedParts[key] = false
      }
    })

    const sexo = this.humanSex() as SexoUsuario
    const proximoValor = mapeamento[message]?.[sexo]

    if (proximoValor) {
      this.messageInput().userResponseValue = message
      this.messageInput().next = proximoValor
      this.$messageService.sendNewUserMessage(this.messageInput())
      this.disableSVG.emit(true)
    } else {
      console.log('ERROR AO MAPEAR AVATAR')
    }
  }
}
