export type TFormData = {
  date: string,
  type: 'memo' | 'order' | 'doc' | 'proxy'
  target: string
  theme: string
  listCount: number
  handler: string
  number: string
  lastReplyDate?: string
}
