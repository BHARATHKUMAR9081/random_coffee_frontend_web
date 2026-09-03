import { getJson, postJson } from './http'

export interface ChatMessage {
  id: string
  connectionId: string
  senderId: string
  mine: boolean
  body: string
  createdAt: string | null
}

export function listMessages(connectionId: string, after?: string, limit = 50): Promise<{ messages: ChatMessage[] }> {
  const params = new URLSearchParams()
  if (after) params.set('after', after)
  if (limit) params.set('limit', String(limit))
  const query = params.toString()
  return getJson(`/api/connections/${connectionId}/messages/${query ? `?${query}` : ''}`)
}

export function sendMessage(connectionId: string, body: string): Promise<ChatMessage> {
  return postJson(`/api/connections/${connectionId}/messages/`, { body })
}

export function markConnectionRead(connectionId: string): Promise<unknown> {
  return postJson(`/api/connections/${connectionId}/read/`, {})
}
