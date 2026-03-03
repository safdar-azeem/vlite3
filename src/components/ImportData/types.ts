export interface ImportField {
  field: string
  title: string
  required?: boolean
  matchings?: string[]
  expectedType?: 'string' | 'number' | 'boolean' | 'array' | 'object'
  defaultValue?: any
  onMatch?: (value: any) => any
}

export interface ImportProgress {
  total: number
  processed: number
  created: number
  updated: number
  skipped: number
  failed: number
  percentage: number
  errors: { record: string; message: string }[]
}

export interface ImportOptions {
  existing: 'add' | 'replace' | 'skip'
  new: 'create' | 'skip'
}

export interface ImportBatchPayload {
  data: any[]
  options: ImportOptions
}

export interface ImportBatchResult {
  processed: number
  created: number
  updated: number
  skipped: number
  failed: number
  errors: { record: string; message: string }[]
}

export interface ImportDataProps {
  title?: string
  titleI18n?: string
  buttonText?: string
  buttonIcon?: string
  fields: ImportField[]
  batchSize?: number
  processBatch: (payload: ImportBatchPayload) => Promise<ImportBatchResult>
  onComplete?: () => void
}
