import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class GptServiceService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions'
  private apiKey = environment.gptKey

  constructor(private http: HttpClient) {}

  getGptResponse(prompt: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    })

    let fullPrompt = `
      Você é um modelo de inteligência artificial especializado em diagnósticos médicos iniciais. 
      Você receberá um dicionário de dados contendo respostas fornecidas por um paciente em um pré-formulário clínico. Seu objetivo é analisar as informações fornecidas e listar possíveis doenças associadas, acompanhadas de uma estimativa de probabilidade para cada doença.

      Ao receber as respostas, siga rigorosamente as instruções abaixo:

      Avalie cuidadosamente todos os sintomas, histórico médico, idade, gênero, histórico familiar e quaisquer outras informações relevantes fornecidas pelo paciente.

      Liste as possíveis doenças relacionadas às informações recebidas.

      Para cada doença listada, forneça uma probabilidade estimada (em porcentagem) baseada nos dados informados.

      Organize sua resposta em formato estruturado:

      Exemplo:

      1. Doença X - 75%
        Motivos: Sintomas principais relatados são compatíveis, faixa etária e histórico familiar indicam risco aumentado.

      2. Doença Y - 50%
        Motivos: Sintomas parcialmente compatíveis, porém faltam informações adicionais para maior precisão.

      3. Doença Z - 20%
        Motivos: Baixa compatibilidade dos sintomas, baixa prevalência na faixa etária relatada.

      Lembre-se de ser claro, objetivo e fornecer uma breve justificativa para cada estimativa feita. Este diagnóstico é preliminar e deve indicar necessidade de avaliação médica adicional.
    `

    const body = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'developer',
          content: fullPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(prompt, null, 2),
        },
      ],
    }

    return this.http.post(this.apiUrl, body, { headers })
  }
}
