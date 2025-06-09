import { customType } from 'drizzle-orm/pg-core'

export const bytea = customType<{ data: Buffer; default: false }>({
  dataType() {
    return 'bytea'
  },
})
