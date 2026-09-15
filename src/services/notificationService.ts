import { getJson, postJson } from './http'
import { toQuery, type ListQuery, type PageMeta } from './paging'

export interface AppNotification {
  id: string
  kind: string
  title: string
  body: string
  link: string
  relatedId: string | null
  read: boolean
  createdAt: string | null
}

export function listNotifications(query?: ListQuery): Promise<{ notifications: AppNotification[]; unreadCount: number } & Partial<PageMeta>> {
  return getJson(`/notifications/${toQuery(query)}`)
}

export function markNotificationRead(id: string): Promise<AppNotification> {
  return postJson(`/notifications/${id}/read/`, {})
}

export function markAllNotificationsRead(): Promise<{ ok: boolean; unreadCount: number }> {
  return postJson('/notifications/read-all/', {})
}
