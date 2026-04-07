import type { AttachmentItem } from '../AttachmentsList'

export interface CommentAuthor {
  id: string | number
  name: string
  avatar?: string
  role?: string
}

export interface CommentNode {
  id: string | number
  text: string
  author: CommentAuthor
  timestamp?: string | number | Date
  isEdited?: boolean
  editedAt?: string | number | Date
  attachments?: AttachmentItem[]
  replies?: CommentNode[]
  /** Any custom metadata such as 'status' or logic blocks */
  meta?: Record<string, any>
  /** Pagination: flag indicating there are more replies to load natively */
  hasMoreReplies?: boolean
  /** Pagination: flag used by parents to set a loading spinner on the expando */
  loadingMoreReplies?: boolean
  /** Pagination: absolute count of replies if needed for UI text e.g. "View 4 more replies" */
  replyCount?: number
}

export interface CommentActionPayload {
  commentId: string | number
  comment: CommentNode
}

export interface CommentSubmitPayload {
  text: string
  attachments?: AttachmentItem[]
  parentId?: string | number
}
