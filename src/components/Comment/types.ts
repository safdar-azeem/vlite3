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
