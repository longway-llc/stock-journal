export type TFormData = {
  date: string,
  type: 'incoming' | 'outgoing'
  target: string
  theme: string
  handler: string
  number: string
  lastReplyDate?: string
}
