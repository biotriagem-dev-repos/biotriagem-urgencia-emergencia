import { Injectable, inject } from '@angular/core'
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  doc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore'
import { Observable } from 'rxjs'
import { iMessage } from '../interface/iMessage.interface'

// Interfaces (ChatSession, ChatMessage) permanecem as mesmas
export interface ChatMessage {
  id?: string
  sessionId: string
  sender: 'user' | 'bot' | 'model'
  message?: iMessage | string
  resultModel?: string
  timestamp: Timestamp
}

export interface ChatSession {
  id: string // ID é obrigatório e será o mesmo que o ID do documento
  startTime: Timestamp
  endTime?: Timestamp
  userId?: string
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private firestore: Firestore = inject(Firestore)
  private currentSessionId: string | null = null
  private sessionsCollectionPath = 'chatSessions'
  private readonly SESSION_STORAGE_KEY = 'chatSessionId'

  // Promise para controlar inicializações concorrentes
  private sessionInitializationPromise: Promise<
    string | null
  > | null = null

  constructor() {}

  /**
   * Obtém o ID da sessão ativa. Se não houver, tenta carregar do sessionStorage
   * ou criar uma nova sessão no Firebase.
   * Garante que apenas uma operação de inicialização ocorra por vez.
   * @param userId (Opcional) ID do usuário para nova sessão.
   * @returns Promise com o ID da sessão ou null em caso de falha.
   */
  public async getActiveSessionIdOrInitialize(
    userId?: string
  ): Promise<string | null> {
    // Se já temos um ID na memória do serviço, ele já foi validado ou é novo.
    if (this.currentSessionId) {
      return this.currentSessionId
    }

    // Se uma inicialização já está em progresso, retorna a promise existente.
    if (this.sessionInitializationPromise) {
      return this.sessionInitializationPromise
    }

    // Inicia o processo de obtenção/criação da sessão.
    this.sessionInitializationPromise = (async () => {
      const storedSessionId = sessionStorage.getItem(
        this.SESSION_STORAGE_KEY
      )

      const completed = sessionStorage.getItem('completed')

      if (storedSessionId && !completed) {
        const sessionDocRef = doc(
          this.firestore,
          this.sessionsCollectionPath,
          storedSessionId
        ) as DocumentReference<ChatSession>

        try {
          const docSnap = await getDoc(sessionDocRef)
          if (docSnap.exists()) {
            this.currentSessionId = storedSessionId
            console.log(
              'ChatService: Sessão verificada e carregada do sessionStorage:',
              this.currentSessionId
            )
            return this.currentSessionId
          } else {
            console.warn(
              'ChatService: ID de sessão do sessionStorage não existe no Firestore. Removendo...'
            )
            sessionStorage.removeItem(this.SESSION_STORAGE_KEY)
          }
        } catch (error) {
          console.error(
            'ChatService: Erro ao verificar sessão do sessionStorage. Removendo...',
            error
          )
          sessionStorage.removeItem(this.SESSION_STORAGE_KEY)
        }
      }

      // Se não há ID no sessionStorage, ou ele foi invalidado/removido, cria uma nova sessão.
      console.log(
        'ChatService: Nenhuma sessão válida encontrada no sessionStorage, iniciando uma nova.'
      )
      try {
        const newSessionId = await this.createNewFirebaseSession(
          userId
        )
        sessionStorage.setItem(this.SESSION_STORAGE_KEY, newSessionId)
        this.currentSessionId = newSessionId // Armazena na memória do serviço
        console.log(
          'ChatService: Nova sessão iniciada e ID armazenado:',
          newSessionId
        )

        if (completed) sessionStorage.removeItem('completed')
        return newSessionId
      } catch (error) {
        console.error(
          'ChatService: Falha ao criar nova sessão no Firebase.',
          error
        )
        this.currentSessionId = null // Garante que está nulo em caso de falha
        return null
      }
    })().finally(() => {
      // Libera a promise de inicialização para permitir futuras tentativas se necessário.
      this.sessionInitializationPromise = null
    })

    return this.sessionInitializationPromise
  }

  resetSessionInitializationPromise(): void {
    // Método para resetar a promise de inicialização, útil em testes ou reinicializações
    this.sessionInitializationPromise = null
    this.currentSessionId = null // Limpa o ID da sessão atual
    sessionStorage.removeItem(this.SESSION_STORAGE_KEY) // Limpa o sessionStorage
    console.log(
      'ChatService: Promise de inicialização de sessão e ID atual resetados.'
    )
  }

  /**
   * Cria uma nova sessão no Firestore.
   * @param userId (Opcional) ID do usuário.
   * @returns Promise com o ID da nova sessão.
   */
  private async createNewFirebaseSession(
    userId?: string
  ): Promise<string> {
    const sessionsCollectionRef = collection(
      this.firestore,
      this.sessionsCollectionPath
    ) as CollectionReference<ChatSession>
    // Gera um ID para o novo documento ANTES de criá-lo, para poder armazená-lo no próprio documento.
    const newSessionDocRef = doc(sessionsCollectionRef)
    const newId = newSessionDocRef.id

    await setDoc(newSessionDocRef, {
      id: newId, // Armazena o ID do documento dentro do próprio documento
      startTime: serverTimestamp(),
      ...(userId && { userId: userId }),
    })
    return newId
  }

  /**
   * Adiciona uma mensagem à sessão de chat ativa.
   * @param message Objeto da mensagem.
   */
  async addMessageToSession(
    message: Omit<ChatMessage, 'sessionId' | 'timestamp'>
  ): Promise<void> {
    // Garante que a sessão esteja inicializada antes de tentar adicionar uma mensagem.
    if (!this.currentSessionId) {
      console.log(
        'addMessageToSession: currentSessionId não definido. Tentando inicializar/obter sessão...'
      )
      await this.getActiveSessionIdOrInitialize() // Tenta obter/criar uma sessão.
      if (!this.currentSessionId) {
        console.error(
          'Nenhuma sessão de chat ativa para adicionar mensagem após tentativa de inicialização.'
        )
        return // Não prossegue se a sessão não puder ser estabelecida.
      }
    }

    const messagesCollectionPath = `${this.sessionsCollectionPath}/${this.currentSessionId}/messages`
    const messagesCollectionRef = collection(
      this.firestore,
      messagesCollectionPath
    ) as CollectionReference<ChatMessage>

    try {
      await addDoc(messagesCollectionRef, {
        sender: message.sender,
        message: message.message || message.resultModel,
        sessionId: this.currentSessionId, // Usa o ID da sessão ativa.
        timestamp: serverTimestamp(),
      })

      if (
        typeof message.message !== 'string' &&
        message.message?.id == 'formUsuario'
      ) {
        let sessionuserInfo = {
          name: '',
          document: '',
        }

        if (
          typeof message.message !== 'string' &&
          message.message?.inputs
        ) {
          message.message.inputs.forEach((item: any) => {
            if (item.variableName === 'nomeUsuario') {
              sessionuserInfo.name = item.userResponseValue
            } else if (item.variableName === 'cpfUsuario') {
              sessionuserInfo.document = item.userResponseValue
            }
          })
        }

        this.updateSession(sessionuserInfo)
      }

      if (message.sender == 'model') {
        console.log(
          'Mensagem final do modelo recebida. Finalizando a sessão...'
        )

        this.updateSession({
          status: 'Finished',
          finishedAt: serverTimestamp(),
        })

        // NOVO: Limpar o ID da sessão atual para forçar uma nova sessão na próxima vez.
        this.currentSessionId = null
      }

      console.log(
        'Mensagem adicionada à sessão:',
        this.currentSessionId
      )
    } catch (error) {
      console.error('Erro ao adicionar mensagem à sessão:', error)
    }
  }

  async updateSession(message: any): Promise<void> {
    if (!this.currentSessionId) {
      console.error(
        'Nenhuma sessão de chat ativa para adicionar mensagem após tentativa de inicialização.'
      )
      return
    }

    try {
      const sessionDocRef = doc(
        this.firestore,
        this.sessionsCollectionPath,
        this.currentSessionId
      )

      await updateDoc(sessionDocRef, message)
    } catch (error) {
      console.error('Erro ao adicionar mensagem à sessão:', error)
    }
  }

  /**
   * Marca a sessão atual como finalizada no Firestore (registrando endTime)
   * e remove o ID da sessionStorage.
   */
  async endCurrentSessionAndClearStorage(): Promise<void> {
    if (this.currentSessionId) {
      const sessionDocRef = doc(
        this.firestore,
        this.sessionsCollectionPath,
        this.currentSessionId
      ) as DocumentReference<ChatSession>
      try {
        await updateDoc(sessionDocRef, {
          endTime: serverTimestamp(),
        })
        console.log(
          'Sessão de chat marcada como finalizada no Firestore:',
          this.currentSessionId
        )
      } catch (error) {
        console.error(
          'Erro ao marcar sessão como finalizada no Firestore:',
          error
        )
      } finally {
        sessionStorage.removeItem(this.SESSION_STORAGE_KEY)
        console.log(
          'ChatService: Session ID removido do sessionStorage.'
        )
        this.currentSessionId = null // Limpa da memória do serviço
      }
    } else {
      // Se não há currentSessionId, apenas garante que o sessionStorage está limpo.
      sessionStorage.removeItem(this.SESSION_STORAGE_KEY)
      console.warn(
        'ChatService: Tentativa de finalizar sessão, mas nenhuma estava ativa na memória. SessionStorage limpo para garantir.'
      )
    }
  }

  // Método para obter mensagens permanece o mesmo
  getMessagesForSession(
    sessionId: string
  ): Observable<ChatMessage[]> {
    const messagesPath = `${this.sessionsCollectionPath}/${sessionId}/messages`
    const messagesCollectionRef = collection(
      this.firestore,
      messagesPath
    ) as CollectionReference<ChatMessage>
    const q = query(
      messagesCollectionRef,
      orderBy('timestamp', 'asc')
    )
    return collectionData(q, { idField: 'id' }) as Observable<
      ChatMessage[]
    >
  }

  // Método para obter o ID da sessão atual (pode ser útil para o componente)
  getCurrentActiveSessionId(): string | null {
    return this.currentSessionId
  }
}
