export interface iFlow {
  timestamp: Date
  user: string
  flow?: {
    answer: string
    question: string
    type: string
    timestamp: Date
  }
}
