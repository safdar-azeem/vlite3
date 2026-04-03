export type InvoiceVariant = 'Variant1' | 'Variant2' | 'Variant3' | 'Variant4'

export interface InvoiceCustomerInfo {
  name: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  email?: string
  phone?: string
  taxId?: string
  [key: string]: any
}

export interface InvoiceCompanyInfo {
  name: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  email?: string
  phone?: string
  website?: string
  taxId?: string
  [key: string]: any
}

export interface InvoiceLineItem {
  id: string | number
  /** Thumbnail image URL for the product */
  thumbnail?: string
  /** Product SKU */
  sku?: string
  name: string
  description?: string
  /** Product size or variation */
  size?: string
  quantity: number
  price: number
  /** Discount amount applied to this line item */
  discount?: number
  /** Optional label for the discount, e.g. "10% OFF" */
  discountLabel?: string
  total: number
  [key: string]: any
}

export interface InvoiceTotal {
  label: string
  value: number
  isGrandTotal?: boolean
  isSubtotal?: boolean
  isTax?: boolean
  isDiscount?: boolean
}

export interface InvoiceData {
  /** Reference to the image URL for the brand logo */
  brandLogo?: string
  /** Title such as "INVOICE" or "RECEIPT" */
  brandTitle?: string
  /** Name of the brand or company issuing the invoice */
  brandName?: string
  /** The physical/contact info of the issuer */
  companyInfo?: InvoiceCompanyInfo

  invoiceNumber: string
  /** The status string to display, e.g., "Paid", "Pending" */
  status?: string
  /** Issue date of the invoice */
  issuedDate?: string | Date
  /** Due date of the invoice */
  dueDate?: string | Date

  /** Customer details */
  customerInfo?: InvoiceCustomerInfo

  /** Array of line items */
  items: InvoiceLineItem[]

  /** Array of totals to display at the bottom */
  totals: InvoiceTotal[]

  /** A barcode string */
  barcode?: string
  /** A QR Code string */
  qrcode?: string

  /** Additional notes at the bottom of the invoice */
  notes?: string
  /** Footer text, usually for terms and conditions */
  footerText?: string
}

export interface InvoiceLabels {
  invoice?: string
  invoiceNumber?: string
  issued?: string
  due?: string
  from?: string
  billedTo?: string
  status?: string
  item?: string
  price?: string
  qty?: string
  size?: string
  discount?: string
  total?: string
  notes?: string
  sku?: string
  taxId?: string
}

export interface InvoiceProps {
  data: InvoiceData
  variant?: InvoiceVariant
  /**
   * When true, reduces padding, spacing, and font sizes across the invoice
   * for a more compact, print-friendly layout that uses less paper.
   */
  compact?: boolean
  /**
   * Whether to display the text value underneath the barcode
   */
  displayBarcodeValue?: boolean
  /**
   * Custom text labels for static UI strings (e.g. overriding "Invoice", "Issued")
   */
  labels?: InvoiceLabels
}
