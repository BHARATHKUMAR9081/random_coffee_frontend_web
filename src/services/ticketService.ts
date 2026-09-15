import { getJson, postJson } from './http'
import { toQuery, type ListQuery, type PageMeta } from './paging'

export type TicketCategory = 'bug' | 'payment' | 'account' | 'call' | 'other'
export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed' | string

export interface TicketComment {
  id: string
  ticketId: string
  authorId: string
  authorType: 'user' | 'admin' | string
  mine: boolean
  body: string
  createdAt: string | null
}

export interface SupportTicket {
  id: string
  category: TicketCategory | string
  subject: string
  body: string
  status: TicketStatus
  imageUrl: string | null
  comments?: TicketComment[]
  createdAt: string | null
  updatedAt: string | null
  resolvedAt: string | null
  resolvedBy?: string | null
  resolvedById?: string | null
}

export function listTickets(query?: ListQuery): Promise<{ tickets: SupportTicket[] } & PageMeta> {
  return getJson(`/tickets/${toQuery(query)}`)
}

export function createTicket(payload: {
  category: TicketCategory
  subject: string
  body: string
  imageUrl?: string
  imagePath?: string
}): Promise<SupportTicket> {
  return postJson('/tickets/', payload)
}

export function fetchTicket(ticketId: string): Promise<SupportTicket> {
  return getJson(`/tickets/${ticketId}/`)
}

export function addTicketComment(ticketId: string, body: string): Promise<TicketComment> {
  return postJson(`/tickets/${ticketId}/comments/`, { body })
}
