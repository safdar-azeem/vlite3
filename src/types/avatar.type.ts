export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: AvatarSize
  rounded?: AvatarRounded
  class?: string
}
