import type { ChipVariant } from '@/components/Chip/types'

export interface StatusConfig {
  variant: ChipVariant | string
  icon?: string
  label?: string
}

/**
 * Canonical status → chip config map.
 * Keys are normalized (lowercase, no spaces/underscores/hyphens).
 * The `label` field overrides the displayed text when set.
 */
export const STATUS_MAP: Record<string, StatusConfig> = {
  // ── Active / Positive ──────────────────────────────────────────────────────
  active: { variant: 'success', icon: 'lucide:check-circle-2' },
  activated: { variant: 'success', icon: 'lucide:check-circle-2' },
  approved: { variant: 'success', icon: 'lucide:check-circle-2' },
  completed: { variant: 'success', icon: 'lucide:check-circle-2' },
  complete: { variant: 'success', icon: 'lucide:check-circle-2' },
  done: { variant: 'success', icon: 'lucide:check-circle-2' },
  delivered: { variant: 'teal', icon: 'lucide:check-circle-2' },
  paid: { variant: 'success', icon: 'lucide:check-circle-2' },
  confirmed: { variant: 'success', icon: 'lucide:check-circle-2' },
  verified: { variant: 'success', icon: 'lucide:shield-check' },
  accepted: { variant: 'success', icon: 'lucide:thumbs-up' },
  resolved: { variant: 'success', icon: 'lucide:check-circle-2' },
  closed: { variant: 'secondary', icon: 'lucide:lock' },
  enabled: { variant: 'success', icon: 'lucide:toggle-right' },
  open: { variant: 'success', icon: 'lucide:unlock' },
  available: { variant: 'teal', icon: 'lucide:circle-check' },
  present: { variant: 'success', icon: 'lucide:user-check' },
  shipped: { variant: 'teal', icon: 'lucide:truck' },
  arrived: { variant: 'teal', icon: 'lucide:map-pin' },
  published: { variant: 'success', icon: 'lucide:globe' },
  online: { variant: 'indigo', icon: 'lucide:globe' },
  success: { variant: 'success', icon: 'lucide:check-circle-2' },
  passed: { variant: 'success', icon: 'lucide:check-circle-2' },
  instock: { variant: 'success', icon: 'lucide:package-check' },
  fulfilled: { variant: 'success', icon: 'lucide:package-check' },

  // ── CRM / Sales / Leads ───────────────────────────────────────────────────
  prospecting: { variant: 'indigo', icon: 'lucide:search' },
  qualification: { variant: 'purple', icon: 'lucide:filter' },
  proposal: { variant: 'cyan', icon: 'lucide:file-text' },
  negotiation: { variant: 'orange', icon: 'lucide:handshake' },
  won: { variant: 'success', icon: 'lucide:trophy' },
  closedwon: { variant: 'success', icon: 'lucide:trophy', label: 'Closed Won' },
  lost: { variant: 'danger', icon: 'lucide:frown' },
  closedlost: { variant: 'danger', icon: 'lucide:frown', label: 'Closed Lost' },
  contacted: { variant: 'blue', icon: 'lucide:message-square' },
  qualified: { variant: 'success', icon: 'lucide:user-check' },

  // ── In Progress / Processing / Transit ─────────────────────────────────────
  inprogress: { variant: 'info', icon: 'lucide:loader-2' },
  processing: { variant: 'info', icon: 'lucide:loader-2' },
  running: { variant: 'indigo', icon: 'lucide:play-circle' },
  started: { variant: 'indigo', icon: 'lucide:play-circle' },
  ongoing: { variant: 'info', icon: 'lucide:activity' },
  inreview: { variant: 'indigo', icon: 'lucide:eye' },
  reviewing: { variant: 'indigo', icon: 'lucide:eye' },
  underreview: { variant: 'indigo', icon: 'lucide:eye' },
  submitted: { variant: 'indigo', icon: 'lucide:send' },
  submited: { variant: 'indigo', icon: 'lucide:send' },
  sent: { variant: 'cyan', icon: 'lucide:send' },
  scheduled: { variant: 'cyan', icon: 'lucide:calendar-clock' },
  syncing: { variant: 'purple', icon: 'lucide:refresh-cw' },
  uploading: { variant: 'purple', icon: 'lucide:upload' },
  loading: { variant: 'info', icon: 'lucide:loader-2' },
  info: { variant: 'info', icon: 'lucide:info' },
  intransit: { variant: 'purple', icon: 'lucide:truck' },
  dispatched: { variant: 'cyan', icon: 'lucide:truck' },
  partial: { variant: 'cyan', icon: 'lucide:git-commit' },
  partiallypaid: { variant: 'cyan', icon: 'lucide:coins' },

  // ── Pending / Warning ──────────────────────────────────────────────────────
  pending: { variant: 'warning', icon: 'lucide:clock' },
  waiting: { variant: 'warning', icon: 'lucide:clock' },
  onhold: { variant: 'orange', icon: 'lucide:pause-circle' },
  hold: { variant: 'orange', icon: 'lucide:pause-circle' },
  paused: { variant: 'orange', icon: 'lucide:pause-circle' },
  draft: { variant: 'secondary', icon: 'lucide:file-edit' },
  unpaid: { variant: 'warning', icon: 'lucide:circle-dollar-sign' },
  overdue: { variant: 'orange', icon: 'lucide:alarm-clock' },
  expiring: { variant: 'orange', icon: 'lucide:timer' },
  expiringsoon: { variant: 'orange', icon: 'lucide:timer' },
  low: { variant: 'secondary', icon: 'lucide:arrow-down' },
  lowstock: { variant: 'orange', icon: 'lucide:package' },
  warning: { variant: 'warning', icon: 'lucide:alert-triangle' },
  late: { variant: 'orange', icon: 'lucide:alarm-clock' },
  partiallyapproved: { variant: 'orange', icon: 'lucide:check' },
  awaitingapproval: { variant: 'warning', icon: 'lucide:clock' },
  onleave: { variant: 'warning', icon: 'lucide:calendar-clock' },
  earlycheckout: { variant: 'warning', icon: 'lucide:clock-4' },

  // ── Error / Danger / Alternative Warnings ──────────────────────────────────
  inactive: { variant: 'secondary', icon: 'lucide:circle-slash' },
  deactivated: { variant: 'secondary', icon: 'lucide:circle-slash' },
  rejected: { variant: 'danger', icon: 'lucide:x-circle' },
  failed: { variant: 'danger', icon: 'lucide:x-circle' },
  cancelled: { variant: 'pink', icon: 'lucide:ban' },
  canceled: { variant: 'pink', icon: 'lucide:ban' },
  terminated: { variant: 'danger', icon: 'lucide:ban' },
  suspended: { variant: 'pink', icon: 'lucide:ban' },
  blocked: { variant: 'danger', icon: 'lucide:shield-off' },
  banned: { variant: 'danger', icon: 'lucide:shield-off' },
  error: { variant: 'danger', icon: 'lucide:x-circle' },
  expired: { variant: 'danger', icon: 'lucide:calendar-x' },
  deleted: { variant: 'danger', icon: 'lucide:trash-2' },
  archived: { variant: 'secondary', icon: 'lucide:archive' },
  disabled: { variant: 'secondary', icon: 'lucide:toggle-left' },
  void: { variant: 'secondary', icon: 'lucide:ban' },
  refunded: { variant: 'pink', icon: 'lucide:corner-up-left' },
  outofstock: { variant: 'danger', icon: 'lucide:package-x' },
  absent: { variant: 'danger', icon: 'lucide:user-x' },
  offline: { variant: 'secondary', icon: 'lucide:wifi-off' },
  danger: { variant: 'danger', icon: 'lucide:alert-circle' },
  declined: { variant: 'danger', icon: 'lucide:thumbs-down' },
  laidoff: { variant: 'danger', icon: 'lucide:user-minus' },

  // ── Communication & Presence ──────────────────────────────────────────────
  incoming: { variant: 'blue', icon: 'lucide:arrow-down-left' },
  outgoing: { variant: 'indigo', icon: 'lucide:arrow-up-right' },
  missed: { variant: 'danger', icon: 'lucide:phone-missed' },
  inperson: { variant: 'indigo', icon: 'lucide:users', label: 'In Person' },

  // ── Priority / Severity ────────────────────────────────────────────────────
  critical: { variant: 'danger', icon: 'lucide:alert-octagon' },
  high: { variant: 'danger', icon: 'lucide:arrow-up-circle' },
  urgent: { variant: 'danger', icon: 'lucide:zap' },
  medium: { variant: 'warning', icon: 'lucide:minus-circle' },
  normal: { variant: 'secondary', icon: 'lucide:circle' },
  minor: { variant: 'secondary', icon: 'lucide:arrow-down' },
  trivial: { variant: 'secondary', icon: 'lucide:info' },

  // ── Boolean / Logic ────────────────────────────────────────────────────────
  yes: { variant: 'success', icon: 'lucide:check' },
  no: { variant: 'danger', icon: 'lucide:x' },
  true: { variant: 'success', icon: 'lucide:check' },
  false: { variant: 'danger', icon: 'lucide:x' },

  // ── Finance / Accounting / Sales ───────────────────────────────────────────
  invoiced: { variant: 'indigo', icon: 'lucide:receipt' },
  billed: { variant: 'indigo', icon: 'lucide:receipt-text' },
  unbilled: { variant: 'warning', icon: 'lucide:file-warning' },
  quoted: { variant: 'cyan', icon: 'lucide:file-text' },
  authorized: { variant: 'success', icon: 'lucide:shield-check' },
  unauthorized: { variant: 'danger', icon: 'lucide:shield-off' },
  cleared: { variant: 'success', icon: 'lucide:check-circle' },
  reconciled: { variant: 'success', icon: 'lucide:check-square' },
  unreconciled: { variant: 'warning', icon: 'lucide:alert-circle' },
  posted: { variant: 'success', icon: 'lucide:file-check' },
  unposted: { variant: 'secondary', icon: 'lucide:file-x' },
  settled: { variant: 'success', icon: 'lucide:handshake' },
  voided: { variant: 'secondary', icon: 'lucide:ban' },
  profit: { variant: 'success', icon: 'lucide:trending-up' },
  loss: { variant: 'danger', icon: 'lucide:trending-down' },
  revenue: { variant: 'success', icon: 'lucide:coins' },
  journal: { variant: 'purple', icon: 'lucide:book-open' },
  journalentry: { variant: 'purple', icon: 'lucide:book-open', label: 'Journal Entry' },
  voucher: { variant: 'cyan', icon: 'lucide:ticket' },

  // ── Payment Methods ────────────────────────────────────────────────────────
  cash: { variant: 'success', icon: 'lucide:banknote' },
  check: { variant: 'blue', icon: 'lucide:receipt' },
  card: { variant: 'purple', icon: 'lucide:credit-card' },
  transfer: { variant: 'cyan', icon: 'lucide:arrow-right-left' },
  bank: { variant: 'blue', icon: 'lucide:landmark' },
  app: { variant: 'indigo', icon: 'lucide:smartphone' },
  checkslip: { variant: 'secondary', icon: 'lucide:receipt', label: 'Check Slip' },
  bankcheck: { variant: 'blue', icon: 'lucide:receipt', label: 'Bank Check' },

  // ── HR / Recruiting ────────────────────────────────────────────────────────
  hired: { variant: 'success', icon: 'lucide:user-check' },
  interviewing: { variant: 'indigo', icon: 'lucide:users' },
  shortlisted: { variant: 'teal', icon: 'lucide:list-checks' },
  offered: { variant: 'purple', icon: 'lucide:award' },
  onboarding: { variant: 'info', icon: 'lucide:user-plus' },
  probation: { variant: 'warning', icon: 'lucide:user-cog' },
  promoted: { variant: 'success', icon: 'lucide:trending-up' },
  relocated: { variant: 'cyan', icon: 'lucide:plane' },

  // ── Neutral / Secondary ────────────────────────────────────────────────────
  new: { variant: 'secondary', icon: 'lucide:sparkles' },
  unassigned: { variant: 'secondary', icon: 'lucide:user-x' },
  unverified: { variant: 'secondary', icon: 'lucide:shield' },
  unknown: { variant: 'secondary', icon: 'lucide:help-circle' },
  notstarted: { variant: 'secondary', icon: 'lucide:minus-circle' },
  todo: { variant: 'secondary', icon: 'lucide:circle' },
  queued: { variant: 'secondary', icon: 'lucide:list-ordered' },
  requested: { variant: 'secondary', icon: 'lucide:send' },
  invited: { variant: 'secondary', icon: 'lucide:mail' },
  offday: { variant: 'secondary', icon: 'lucide:calendar-off' },
  resigned: { variant: 'secondary', icon: 'lucide:user-minus' },
  default: { variant: 'secondary' },
  none: { variant: 'secondary' },

  // ── Customer Type ──────────────────────────────────────────────────────────
  receiving: { variant: 'info', icon: 'lucide:arrow-down-circle' },
  giving: { variant: 'orange', icon: 'lucide:arrow-up-circle' },
  dual: { variant: 'purple', icon: 'lucide:arrow-left-right' },

  // ── Invoice Status ─────────────────────────────────────────────────────────
  // pending  → already mapped above (warning / clock)
  // sent     → already mapped above (cyan / send)
  // approved → already mapped above (success / check-circle-2)
  // rejected → already mapped above (danger / x-circle)
  // canceled → already mapped above (pink / ban)
  // completed → already mapped above (success / check-circle-2)
  partialreceive: { variant: 'cyan', icon: 'lucide:git-commit', label: 'Partial Receive' },
  returned: { variant: 'pink', icon: 'lucide:corner-up-left' },

  // ── Invoice Type ───────────────────────────────────────────────────────────
  sale: { variant: 'success', icon: 'lucide:shopping-cart' },
  expense: { variant: 'warning', icon: 'lucide:receipt' },
  expenses: { variant: 'warning', icon: 'lucide:receipt' },

  // ── Payment Type ───────────────────────────────────────────────────────────
  debit: { variant: 'danger', icon: 'lucide:arrow-up-right' },
  credit: { variant: 'success', icon: 'lucide:arrow-down-left' },

  // ── Payment Method ─────────────────────────────────────────────────────────
  // cash     → already mapped above (success / banknote)
  // card     → already mapped above (purple / credit-card)
  // transfer → already mapped above (cyan / arrow-right-left)
  // online   → already mapped above (indigo / globe)

  // ── Tax Type ───────────────────────────────────────────────────────────────
  percentage: { variant: 'purple', icon: 'lucide:percent' },
  fixed: { variant: 'cyan', icon: 'lucide:hash' },

  // ── Product Type ───────────────────────────────────────────────────────────
  digital: { variant: 'indigo', icon: 'lucide:monitor' },
  physical: { variant: 'teal', icon: 'lucide:package' },
  service: { variant: 'blue', icon: 'lucide:briefcase' },
  other: { variant: 'secondary', icon: 'lucide:more-horizontal' },
}

/**
 * Normalizes a status string to a canonical lookup key.
 * Strips spaces, underscores, hyphens, and lowercases the result.
 * e.g. 'In Progress' → 'inprogress', 'in_progress' → 'inprogress'
 */
export function normalizeStatus(status: string): string {
  return status.toLowerCase().replace(/[\s_\-]+/g, '')
}

/**
 * Resolves a status string to its StatusConfig.
 * Checks global custom statuses first to allow overwriting defaults.
 * Falls back to a secondary chip with the raw label if not found.
 */
export function resolveStatus(
  status: string,
  customStatuses?: Record<string, StatusConfig>
): StatusConfig {
  const key = normalizeStatus(status)

  if (customStatuses) {
    for (const [customKey, customConfig] of Object.entries(customStatuses)) {
      if (normalizeStatus(customKey) === key) {
        return customConfig
      }
    }
  }

  return STATUS_MAP[key] ?? { variant: 'secondary' }
}
