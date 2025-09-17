import { inject, Pipe, PipeTransform } from '@angular/core'
import { iVariable } from '../interface/iVariable.interface'
import { MessageService } from '../services/message.service'

@Pipe({
  name: 'variable',
})
export class VariablePipe implements PipeTransform {
  private $messageService = inject(MessageService)

  transform(value: string | undefined | null): string {
    if (value === null || value === undefined) {
      return ''
    }

    const keys = this.extractKeys(value)
    const botVariables: iVariable[] =
      this.$messageService.botVariables()

    let newValue = value
    for (const key of keys) {
      const variable = botVariables.find((v) => v.key === key)
      if (variable) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        newValue = newValue.replace(regex, variable.value)
      }
    }

    return newValue
  }

  extractKeys(str: string): string[] {
    const regex = /\{\{(.*?)\}\}/g
    const valores: string[] = []
    let match: RegExpExecArray | null

    while ((match = regex.exec(str)) !== null) {
      valores.push(match[1])
    }

    return valores
  }
}
