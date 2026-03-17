export interface AttachmentItem {
  fileName?: string
  fileSize?: number
  fileUrl: string
  [key: string]: any
}

export interface AttachmentsListProps {
  attachments?: AttachmentItem | AttachmentItem[]
}
