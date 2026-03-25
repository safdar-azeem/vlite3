export interface AttachmentItem {
  fileName?: string
  fileSize?: number
  fileUrl: string
  [key: string]: any
}

export interface AttachmentsListProps {
  attachments?: AttachmentItem | AttachmentItem[]
  canView?: boolean
  canDownload?: boolean
  /**
   * 'default' - standalone card style with border/muted background
   * 'inline'  - transparent overlay style for embedding inside chat bubbles
   */
  variant?: 'default' | 'inline'
}
