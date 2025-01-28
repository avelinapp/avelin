import { cache } from 'react'
import * as session from '../session.js'

export const validateSession = cache(session.validateSession)
