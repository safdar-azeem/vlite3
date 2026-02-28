export interface PricingPlanFeature {
  text: string
  textI18n?: string
  included: boolean
}

export interface PricingPlanItemSchema {
  id: string | number
  title: string
  titleI18n?: string
  price: string | number
  period?: string 
  periodI18n?: string
  description?: string
  descriptionI18n?: string
  features?: (string | PricingPlanFeature)[]
  popular?: boolean
  recommended?: boolean 
  buttonText?: string
  buttonTextI18n?: string
  variant?: 'outline' | 'solid'
  [key: string]: any
}

export type PricingPlanVariant = 'outline' | 'solid'

export interface PricingPlanProps {
  items: PricingPlanItemSchema[]
  modelValue?: string | number | null
  variant?: PricingPlanVariant
  columns?: number | string 
  gap?: number
}

