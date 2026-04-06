export type FooterVariant = 'Variant1' | 'Variant2' | 'Variant3'

// ─── Social Link ──────────────────────────────────────────────────────────────
export interface FooterSocialLink {
  /** Iconify icon name (e.g., 'lucide:instagram') or image URL */
  icon: string
  /** Full URL for the social link */
  url: string
  /** Accessible label for screen readers (e.g., 'Instagram') */
  label?: string
}

// ─── Individual Link ──────────────────────────────────────────────────────────
export interface FooterLink {
  /** Display text for the link */
  label: string
  /** Full URL (href) */
  url: string
  /** If true, link opens in a new tab with rel="noopener noreferrer" */
  external?: boolean
  /** Optional leading icon (Iconify name or image URL) */
  icon?: string
}

// ─── Link Group (Column) ─────────────────────────────────────────────────────
export interface FooterLinkGroup {
  /** Column heading (e.g., 'Product', 'Company', 'Resources') */
  title: string
  /** Array of links in this group */
  links: FooterLink[]
}

// ─── Newsletter Configuration ─────────────────────────────────────────────────
export interface FooterNewsletterConfig {
  /** Title text (e.g., "Stay updated") */
  title?: string
  /** Description text (e.g., "Subscribe to our newsletter for the latest updates.") */
  description?: string
  /** Input placeholder text */
  placeholder?: string
  /** Submit button text */
  buttonText?: string
}

// ─── Root Data Object ─────────────────────────────────────────────────────────
export interface FooterData {
  // ── Brand ──
  /** Company / brand name displayed in the footer */
  brandName?: string
  /** URL to brand logo image, or an Iconify icon name */
  brandLogo?: string
  /** Brand tagline or short description */
  brandDescription?: string

  // ── Navigation ──
  /** Column-based link groups (e.g., Product, Company, Resources) */
  linkGroups?: FooterLinkGroup[]
  /** Social media icon links (rendered as icon buttons) */
  socialLinks?: FooterSocialLink[]

  // ── Legal / Bottom Bar ──
  /** Copyright text (e.g., '© 2024 Acme Inc. All rights reserved.') */
  copyright?: string
  /** Legal links displayed in the bottom bar (e.g., Terms, Privacy Policy) */
  legalLinks?: FooterLink[]

  // ── Optional Sections ──
  /** Newsletter subscription section configuration */
  newsletter?: FooterNewsletterConfig
  /** Small badge text near brand (e.g., version number, status) */
  badge?: string
}

// ─── Label Overrides ──────────────────────────────────────────────────────────
export interface FooterLabels {
  /** Replaces the default "Follow us" heading above social icons */
  followUs?: string
  /** Replaces the default "Subscribe" button text */
  subscribe?: string
  /** Replaces the default "Newsletter" heading */
  newsletter?: string
}

// ─── Component Props ──────────────────────────────────────────────────────────
export interface FooterProps {
  /** The complete footer data object (required) */
  data: FooterData
  /** Visual style variant */
  variant?: FooterVariant
  /** Custom text label overrides for static UI strings */
  labels?: FooterLabels
  /** Custom CSS class for the root container */
  containerClass?: string | any[] | Record<string, boolean>
}
