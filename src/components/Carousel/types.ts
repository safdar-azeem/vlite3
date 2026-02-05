export interface CarouselProps {
  data?: any[]
  pagination?: string | string[] | boolean
  paginationSize?: 'sm' | 'md' | 'lg'
  paginationPosition?: string | string[]
  paginationVisibility?: string | string[]
  paginationHoverInitialTimeout?: number
  paginationHoverEdgeThreshold?: number
  direction?: 'horizontal' | 'vertical'
  autoPlay?: boolean
  draggable?: boolean
  autoPlayInterval?: number
  itemsToShow?: number | Record<number, number>
  gap?: number
  speed?: number
  easing?: string
  mousewheel?: boolean
  loop?: boolean
  currentItem?: number
  bufferSize?: number
  maxDomElements?: number
  updateKey?: string | number
  // Allow extra props
  [key: string]: any
}
