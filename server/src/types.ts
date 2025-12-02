export interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  note?: string
  lastContacted: string // YYYY-MM-DD
}
