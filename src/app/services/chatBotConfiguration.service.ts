import { inject, Injectable } from '@angular/core'
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore'
import { map, Observable } from 'rxjs'
import { iFlow } from '../interface/iFlow.interface'

@Injectable({
  providedIn: 'root',
})
export class ChatBotConfigurationService {
  private firestore = inject(Firestore)

  async createItem(data: iFlow): Promise<void> {
    const itemsCollection = collection(this.firestore, 'chatbot')
    await addDoc(itemsCollection, data)
  }

  async updateItem(id: string, data: any): Promise<void> {
    const itemDoc = doc(this.firestore, `chatbot/${id}`)
    await updateDoc(itemDoc, data)
  }

  async deleteItem(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `chatbot/${id}`)
    await deleteDoc(itemDoc)
  }

  getItemById(id: string): Observable<any> {
    const itemDoc = doc(this.firestore, `chatbot/${id}`)
    return docData(itemDoc, { idField: 'id' })
  }

  getItems(): Observable<any[]> {
    const itemsCollection = collection(this.firestore, 'chatbot')
    return collectionData(itemsCollection, { idField: 'id' }).pipe(
      map((items) =>
        items.map((item) => {
          return item
        })
      )
    )
  }

  async createItemPOC(): Promise<void> {
    const data = {
      timestamp: new Date(),
      title: 'Dr. Daniel',
      description: 'Teste',
      layout: {
        colorHeader: '#0288d1',
        colorText: '#000000',
      },
      rules: [
        {
          score: 10,
          text: 'Seu diagnóstico é: ANGINA ESTÁVEL',
        },
        {
          score: 13,
          text: 'Seu diagnóstico é: ANGINA INSTÁVEL',
        },
        {
          score: 20,
          text: 'Seu diagnóstico é: INFARTO',
        },
      ],
      flow: [
        {
          type: 'option',
          text: 'Selecione o que melhor descreve o que você está sentindo:',
          options: [
            {
              text: 'Dor',
              score: 1,
            },
          ],
          direction: 'left',
          sender: 'bot',
        },
        {
          if: {
            conditions: [
              {
                values: ['Emergência'],
                operator: '=',
              },
            ],
            mainOperator: 'OR',
          },
          then: {
            botMessages: [
              {
                type: 'option',
                text: 'Como podemos te ajudar?',
                options: [
                  {
                    text: 'Chamar emergência 192',
                    style: 'btn-danger',
                  },
                  {
                    text: 'Auxilio transporte paciente hospitalar',
                  },
                  {
                    text: 'Ressuscitação cardiovascular',
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                if: {
                  conditions: [
                    {
                      values: [
                        'Auxilio transporte paciente hospitalar',
                      ],
                      operator: '=',
                    },
                  ],
                  mainOperator: 'OR',
                },
                then: {
                  botMessages: [
                    {
                      type: 'text',
                      text: 'Aguardando condições...',
                      direction: 'left',
                      sender: 'bot',
                    },
                  ],
                },
              },
              {
                if: {
                  conditions: [
                    {
                      values: ['Ressuscitação cardiovascular'],
                      operator: '=',
                    },
                  ],
                  mainOperator: 'OR',
                },
                then: {
                  botMessages: [
                    {
                      type: 'structured',
                      text: "⚠️ Como realizar a Ressuscitação Cardiopulmonar (RCP):\n\n1️⃣ Verifique a consciência da vítima.\n   - Toque nos ombros e pergunte em voz alta: 'Você está bem?'\n\n2️⃣ Chame ajuda.\n   - Se a pessoa não responder, peça para alguém ligar para o serviço de emergência (192 no Brasil) ou ligue você mesmo.\n\n3️⃣ Verifique a respiração.\n   - Se a vítima não estiver respirando ou estiver com respiração anormal, inicie a RCP imediatamente.\n\n4️⃣ Inicie as compressões torácicas.\n   - Coloque as mãos entrelaçadas no centro do peito da vítima.\n   - Pressione com força (cerca de 5 cm de profundidade) e rápido (100 a 120 compressões por minuto).\n\n5️⃣ Realize a ventilação (se souber).\n   - Após 30 compressões, dê 2 respirações boca a boca.\n\n6️⃣ Continue até ajuda chegar.\n   - Não pare até a vítima recobrar a consciência ou o socorro chegar.\n\n💡 DICA: Se não souber fazer ventilação, continue apenas com as compressões torácicas.",
                      video:
                        'https://www.youtube.com/watch?v=j0Jwj8KKY5c',
                      direction: 'left',
                      sender: 'bot',
                    },
                  ],
                },
              },
              {
                if: {
                  conditions: [
                    {
                      values: ['Chamar emergência 192'],
                      operator: '=',
                    },
                  ],
                  mainOperator: 'OR',
                },
                then: {
                  botMessages: [
                    {
                      type: 'text',
                      text: 'Iniciando sua ligação...',
                      direction: 'left',
                      sender: 'bot',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          if: {
            conditions: [
              {
                values: ['Dor'],
                operator: '=',
              },
            ],
            mainOperator: 'OR',
          },
          then: {
            botMessages: [
              {
                type: 'human_head',
                text: 'Em qual região do corpo você está sentindo dor?',
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'option',
                text: 'Qual a intensidade da dor?',
                options: [
                  {
                    text: 'Muito intensa',
                    score: 4,
                  },
                  {
                    text: 'Intensa',
                    score: 3,
                  },
                  {
                    text: 'Moderada',
                    score: 2,
                  },
                  {
                    text: 'Leve',
                    score: 1,
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'multiple_option',
                text: 'Você está sentindo dor em alguma dessas regiões?',
                options: [
                  {
                    text: 'Aperto',
                    selected: false,
                    rating: false,
                    score: 4,
                  },
                  {
                    text: 'Pressão',
                    selected: false,
                    rating: false,
                    score: 3,
                  },
                  {
                    text: 'Queimação',
                    selected: false,
                    rating: false,
                    score: 3,
                  },
                  {
                    text: 'Desconforto',
                    selected: false,
                    rating: false,
                    score: 3,
                  },
                  {
                    text: 'Estresse emocional',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Exposição ao frio',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Emoções intensas',
                    selected: false,
                    rating: false,
                    score: 3,
                  },
                  {
                    text: 'Sensação de formigamento',
                    selected: false,
                    rating: false,
                    score: 4,
                  },
                  {
                    text: 'Paralisia',
                    selected: false,
                    rating: false,
                    score: 4,
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'option',
                text: 'A quanto tempo você está sentindo dor?',
                options: [
                  {
                    text: 'menos de 5 minutos',
                    score: 1,
                  },
                  {
                    text: 'entre 5 e 20 minutos',
                    score: 2,
                  },
                  {
                    text: 'mais de 20 minutos',
                    score: 4,
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'multiple_option',
                text: 'Em quais momentos ou situações você percebe que a dor se intensifica?',
                options: [
                  {
                    text: 'Com estresse',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Com atividade física',
                    selected: false,
                    rating: false,
                    score: 3,
                  },
                  {
                    text: 'Deitado',
                    selected: false,
                    rating: false,
                    score: 4,
                  },
                  {
                    text: 'Com respiração produnda',
                    selected: false,
                    rating: false,
                    score: 2,
                  },
                  {
                    text: 'Com tosse',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Com respiração profunda',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'multiple_option',
                text: 'Em quais momentos ou situações você percebe que a dor diminui ou desaparece?',
                options: [
                  {
                    text: 'Com repouso',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Não melhora com repouso',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Nitrato',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Não melhora com nitrato',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'multiple_option',
                text: 'Em geral, como você descreveria a quantidade de suor que você está produzindo?',
                options: [
                  {
                    text: 'Excessivo',
                    selected: false,
                    rating: true,
                    ratingMessage:
                      'Em uma escala de 1 a 5, sendo 1 suor excessivo e 5 sem suor, como você classificaria o seu nível de suor?',
                    score: 1,
                  },
                  {
                    text: 'Leve',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                  {
                    text: 'Suor frio (Sudorese)',
                    selected: false,
                    rating: false,
                    score: 1,
                  },
                ],
                direction: 'left',
                sender: 'bot',
              },
              {
                type: 'rating',
                text: 'Em geral, como você descreveria a quantidade de suor que você está produzindo?',
                direction: 'left',
                sender: 'bot',
              },
            ],
          },
        },
      ],
    }

    const itemsCollection = collection(this.firestore, 'chatbot')
    await addDoc(itemsCollection, data)
  }
}
