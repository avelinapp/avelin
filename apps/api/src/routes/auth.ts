import { auth as betterAuth } from '@avelin/auth'
import { Elysia } from 'elysia'

export const auth = new Elysia().mount('/auth', betterAuth.handler)
