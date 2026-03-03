export interface ExportField {
  field: string
  title: string
  format?: (value: any, row: any) => any
}

export type ExportFormat = 'excel' | 'csv' | 'json'

export interface ExportDataProps {
  data: any[]
  title?: string
  fields: ExportField[]
  formats?: ExportFormat[]
  filename?: string
  buttonText?: string
  buttonIcon?: string
  mode?: 'frontend' | 'backend'
  onExport?: (format: ExportFormat) => Promise<void> | void
}
