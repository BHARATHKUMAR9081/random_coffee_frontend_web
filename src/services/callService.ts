import { postJson } from './http'

export interface CallTokenResponse {
  url: string
  token: string
  roomName: string
}

export function fetchCallToken(identity: string, name: string): Promise<CallTokenResponse> {
  return postJson<CallTokenResponse>('/api/calls/token/', { identity, name })
}
