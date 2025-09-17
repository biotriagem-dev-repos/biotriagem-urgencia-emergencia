import { iOption } from './iOption.interface'
import { iRating } from './iRating.interface'

export interface iMessage {
  id: string
  userResponse: boolean
  type:
    | 'text'
    | 'option'
    | 'form'
    | 'avatar'
    | 'body_parts'
    | 'final_result'
  text?: string
  direction?: 'left' | 'right'
  sender?: 'bot' | 'user'
  multipleOptions?: boolean
  userResponseValue?: string
  ratingOptions?: iRating[]
  variableName?: string
  video?: string
  score?: number
  input?: boolean
  inputs?: any[]
  options?: iOption[]
  next?: string
  resultMessage?: string
}
