export type SidePanelPosition = 'left' | 'right'
export type SidePanelSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface SidePanelProps {
  show: boolean
  title?: string
  description?: string
  position?: SidePanelPosition
  size?: SidePanelSize
  closeOutside?: boolean
  hideCloseButton?: boolean
  class?: string
  overlayClass?: string
}
