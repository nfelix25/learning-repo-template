// Lesson 19 — Query Builder: Schema Encoding
//
// Foundation layer for all subsequent build lessons.
// AppSchema is the sample database used throughout lessons 19-26.

export type Column = {
  dataType: 'string' | 'number' | 'boolean' | 'date'
  nullable: boolean
  primaryKey: boolean
}

export type TableSchema = Record<string, Column>

export type DatabaseSchema = Record<string, TableSchema>

export const AppSchema = {
  users: {
    id:        { dataType: 'number',  nullable: false, primaryKey: true  },
    name:      { dataType: 'string',  nullable: false, primaryKey: false },
    email:     { dataType: 'string',  nullable: false, primaryKey: false },
    createdAt: { dataType: 'date',    nullable: false, primaryKey: false },
  },
  posts: {
    id:          { dataType: 'number',  nullable: false, primaryKey: true  },
    userId:      { dataType: 'number',  nullable: false, primaryKey: false },
    title:       { dataType: 'string',  nullable: false, primaryKey: false },
    body:        { dataType: 'string',  nullable: false, primaryKey: false },
    publishedAt: { dataType: 'date',    nullable: false, primaryKey: false },
    deletedAt:   { dataType: 'date',    nullable: true,  primaryKey: false },
  },
} satisfies DatabaseSchema
