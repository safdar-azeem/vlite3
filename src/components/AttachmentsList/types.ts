export interface AttachmentItem {
  fileName?: string
  fileSize?: number
  fileUrl: string
  thumbnailUrl?: string
  fileType?: string
  [key: string]: any
}

export interface AttachmentsListProps {
  attachments?: AttachmentItem | AttachmentItem[]
  canView?: boolean
  canDownload?: boolean
  /**
   * Layout presentation variant
   * 'default' | 'list' - standard vertical list
   * 'inline'  - transparent overlay style for embedding inside chat bubbles
   * 'grid'    - compact squared grid with overlay actions (ideal for galleries)
   * 'card'    - larger card format with prominent preview area
   */
  variant?: 'default' | 'list' | 'inline' | 'card'
  /**
   * Component sizing (primarily affects 'list', 'default', and 'inline' variants)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * When true, clicking the attachment item itself opens the preview modal.
   * The eye icon action button is hidden in this mode.
   * Default: false
   */
  clickToPreview?: boolean
  /**
   * When false, the download action button is hidden from list items.
   * Download remains available inside the preview modal (controlled by canDownload).
   * Default: true
   */
  showDownloadInList?: boolean
}
