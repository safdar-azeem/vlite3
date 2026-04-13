export interface RatingProps {
  modelValue?: number
  max?: number
  allowHalf?: boolean
  readonly?: boolean
  showText?: boolean
  icon?: string | string[]
  activeIcon?: string | string[]
  activeColor?: string
  inactiveColor?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  clearable?: boolean
  disabled?: boolean
  solid?: boolean
  class?: string
}

export interface ReviewSummaryData {
  rating: number
  percentage: number
  count?: number
}

export interface ReviewSummaryProps {
  ratingDistribution: ReviewSummaryData[]
  totalReviews?: number
  averageRating?: number
  showTotal?: boolean
  class?: string
}
