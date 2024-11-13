export type UserInfo = {
  name: string
  color: string
  lastActive: number
  picture?: string
}

export type UserAwareness = {
  user?: UserInfo
}

export type AwarenessList = Array<[number, UserAwareness]>

export const USER_IDLE_TIMEOUT = 3000 as const // Time to wait before setting user as inactive

export type AwarenessChange = {
  added: number[]
  updated: number[]
  removed: number[]
}
