import type { Zero } from '@avelin/zero'

type Writeable<T> = { -readonly [P in keyof T]: T[P] }
type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> }
export type WaitlistEntry = Writeable<Zero.Schema.WaitlistEntry>
