export type UserInfo = {
  name: string
  color: string
  // picture: string
}

export type UserAwareness = {
  user?: UserInfo
}

export type AwarenessList = Array<[number, UserAwareness]>
