export interface AttachmentItem {
  fileName?: string
  fileSize?: number
  fileUrl?: string
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
  // ── Custom CSS class hooks ───────────────────────────────────────────────
  /**
   * Class applied to the root wrapper <div> of the component.
   */
  rootClass?: string
  /**
   * Class applied to the card grid container (card variant only).
   */
  gridClass?: string
  /**
   * Class applied to each card item wrapper (card variant only).
   */
  cardClass?: string
  /**
   * Class applied to the card thumbnail/preview area (card variant only).
   */
  cardThumbnailClass?: string
  /**
   * Class applied to the card footer info area (card variant only).
   */
  cardInfoClass?: string
  /**
   * Class applied to the card overlay actions container (card variant only).
   */
  cardActionsClass?: string
  /**
   * Class applied to the list container (default/list/inline variants).
   */
  listClass?: string
  /**
   * Class applied to each list item row (default/list/inline variants).
   */
  itemClass?: string
  /**
   * Class applied to the icon box within a list item.
   */
  itemIconBoxClass?: string
  /**
   * Class applied to the file name text element.
   */
  itemNameClass?: string
  /**
   * Class applied to the file size / subtext element.
   */
  itemSizeClass?: string
  /**
   * Class applied to the actions container within a list item.
   */
  itemActionsClass?: string
  /**
   * Class applied to the "empty state" placeholder div.
   */
  emptyClass?: string
}
