export interface PricingPlanFeature {
  text: string
  included: boolean
}

export interface PricingPlanItemSchema {
  id: string | number
  title: string
  price: string | number
  period?: string // e.g. '/month', '/year'
  description?: string
  features?: (string | PricingPlanFeature)[]
  popular?: boolean
  recommended?: boolean // alias for popular or specific badge
  buttonText?: string
  variant?: 'outline' | 'solid'
  // Allow arbitrary data
  [key: string]: any
}

export type PricingPlanVariant = 'outline' | 'solid'

export interface PricingPlanProps {
  items: PricingPlanItemSchema[]
  modelValue?: string | number | null
  variant?: PricingPlanVariant
  columns?: number | string // Grid columns
  gap?: number
}
