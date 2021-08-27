export type TFormData = {
  date: string,
  type: 'incoming' | 'outgoing'
  target: string
  theme: string
  listCount: number
  handler: string
  number: string
  lastReplyDate?: string
}
