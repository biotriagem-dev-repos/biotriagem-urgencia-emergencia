export interface iOption {
  text: string
  value: string
  id: string
  style?: string
  type?: string
  variableName?: string
  userResponseValue?: string
  selected?: boolean
  disabled?: boolean
  clearOtherOptions?: boolean
  subOption?: any[]
  color?: string
  next?: string
  textColor?: string
  icon?: string
  image?: string
  fontWeight?: string
  resultMessage?: string
}
