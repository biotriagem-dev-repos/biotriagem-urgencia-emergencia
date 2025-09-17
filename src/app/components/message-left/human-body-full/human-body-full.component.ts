import { CommonModule } from '@angular/common'
import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core'
import { MessageService } from '../../../services/message.service'
import { HumanManFullComponent } from './human-man-full/human-man-full.component'
import { HumanWomanFullComponent } from './human-woman-full/human-woman-full.component'

enum SexoUsuario {
  Feminino = 'Feminino',
  Masculino = 'Masculino',
}

@Component({
  selector: 'app-human-body-full',
  standalone: true,
  imports: [
    CommonModule,
    HumanWomanFullComponent,
    HumanManFullComponent,
  ],
  templateUrl: './human-body-full.component.html',
  styleUrl: './human-body-full.component.scss',
})
export class HumanBodyFullComponent implements OnInit {
  messageInput = input.required<any>()
  showOption = signal<boolean>(false)

  private $messageService = inject(MessageService)

  avatar = signal<string>('Feminino')

  ngOnInit(): void {
    const sexoUsuario = this.obterValorDeChave(
      this.$messageService.finalResult(),
      'sexoUsuario'
    )

    const regiaoCorpoDoi = this.obterValorDeChave(
      this.$messageService.finalResult(),
      'regiaoCorpoDoi'
    )

    if (regiaoCorpoDoi && sexoUsuario) {
      this.avatar.set(regiaoCorpoDoi + sexoUsuario)
      return
    }

    if (sexoUsuario) {
      this.avatar.set(sexoUsuario)
      return
    }
  }

  obterValorDeChave(
    arrayDeDicionarios: any[],
    chaveProcurada: string
  ): string | undefined {
    for (const dicionario of arrayDeDicionarios) {
      if (
        dicionario[chaveProcurada] &&
        dicionario[chaveProcurada].value
      ) {
        return dicionario[chaveProcurada].value
      }
    }
    return undefined
  }

  @ViewChild('svgRef') svgComp!:
    | HumanWomanFullComponent
    | HumanManFullComponent

  private scale = 1 // escala atual
  private minScale = 0.5 // escala mínima
  private maxScale = 5 // escala máxima

  // Para pan/arrasto:
  private isPanning = false
  private startX = 0
  private startY = 0
  private viewBoxX = 0
  private viewBoxY = 0

  onWheel(event: WheelEvent): void {
    event.preventDefault()

    // Calcula o "delta" do scroll
    const delta = -Math.sign(event.deltaY) * 0.1

    // Ajusta escala
    this.scale += delta
    this.scale = Math.min(
      Math.max(this.scale, this.minScale),
      this.maxScale
    )

    // Recalcula o viewBox
    this.updateViewBox()
  }

  onMouseDown(event: MouseEvent): void {
    this.isPanning = true
    this.startX = event.clientX
    this.startY = event.clientY
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isPanning) return

    const dx = event.clientX - this.startX
    const dy = event.clientY - this.startY

    // Ajusta offsets, baseado no zoom atual
    this.viewBoxX -= dx / this.scale
    this.viewBoxY -= dy / this.scale

    this.startX = event.clientX
    this.startY = event.clientY

    this.updateViewBox()
  }

  onMouseUp(event: MouseEvent): void {
    this.isPanning = false
  }

  private updateViewBox(): void {
    // Multiplica largura e altura originais da viewBox pela escala inversa
    const width = 300 / this.scale
    const height = 300 / this.scale

    // Aplica offset (viewBoxX, viewBoxY) e dimensões
    const newViewBox = `${this.viewBoxX} ${this.viewBoxY} ${width} ${height}`

    if (this.svgComp) {
      this.svgComp.viewBox = newViewBox
    }
  }

  disableSVG(disable: boolean) {
    this.showOption.set(disable)
  }
}
