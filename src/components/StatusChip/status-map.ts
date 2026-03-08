import type { ChipVariant } from '@/components/Chip/types'

export interface StatusConfig {
  variant: ChipVariant
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
  active:       { variant: 'success', icon: 'lucide:check-circle-2' },
  activated:    { variant: 'success', icon: 'lucide:check-circle-2' },
  approved:     { variant: 'success', icon: 'lucide:check-circle-2' },
  completed:    { variant: 'success', icon: 'lucide:check-circle-2' },
  complete:     { variant: 'success', icon: 'lucide:check-circle-2' },
  done:         { variant: 'success', icon: 'lucide:check-circle-2' },
  delivered:    { variant: 'success', icon: 'lucide:check-circle-2' },
  paid:         { variant: 'success', icon: 'lucide:check-circle-2' },
  confirmed:    { variant: 'success', icon: 'lucide:check-circle-2' },
  verified:     { variant: 'success', icon: 'lucide:shield-check' },
  accepted:     { variant: 'success', icon: 'lucide:thumbs-up' },
  resolved:     { variant: 'success', icon: 'lucide:check-circle-2' },
  closed:       { variant: 'success', icon: 'lucide:lock' },
  enabled:      { variant: 'success', icon: 'lucide:toggle-right' },
  open:         { variant: 'success', icon: 'lucide:unlock' },
  available:    { variant: 'success', icon: 'lucide:circle-check' },
  present:      { variant: 'success', icon: 'lucide:user-check' },
  shipped:      { variant: 'success', icon: 'lucide:truck' },
  published:    { variant: 'success', icon: 'lucide:globe' },
  online:       { variant: 'success', icon: 'lucide:wifi' },
  success:      { variant: 'success', icon: 'lucide:check-circle-2' },
  passed:       { variant: 'success', icon: 'lucide:check-circle-2' },
  instock:      { variant: 'success', icon: 'lucide:package-check' },
  fulfilled:    { variant: 'success', icon: 'lucide:package-check' },

  // ── In Progress / Neutral Blue ─────────────────────────────────────────────
  inprogress:   { variant: 'info', icon: 'lucide:loader-2' },
  processing:   { variant: 'info', icon: 'lucide:loader-2' },
  running:      { variant: 'info', icon: 'lucide:play-circle' },
  started:      { variant: 'info', icon: 'lucide:play-circle' },
  ongoing:      { variant: 'info', icon: 'lucide:activity' },
  inreview:     { variant: 'info', icon: 'lucide:eye' },
  reviewing:    { variant: 'info', icon: 'lucide:eye' },
  underreview:  { variant: 'info', icon: 'lucide:eye' },
  submitted:    { variant: 'info', icon: 'lucide:send' },
  sent:         { variant: 'info', icon: 'lucide:send' },
  scheduled:    { variant: 'info', icon: 'lucide:calendar-clock' },
  syncing:      { variant: 'info', icon: 'lucide:refresh-cw' },
  uploading:    { variant: 'info', icon: 'lucide:upload' },
  loading:      { variant: 'info', icon: 'lucide:loader-2' },
  info:         { variant: 'info', icon: 'lucide:info' },
  intransit:    { variant: 'info', icon: 'lucide:truck' },
  dispatched:   { variant: 'info', icon: 'lucide:truck' },
  partial:      { variant: 'info', icon: 'lucide:git-commit' },
  partiallypaid:{ variant: 'info', icon: 'lucide:coins' },

  // ── Pending / Warning ──────────────────────────────────────────────────────
  pending:      { variant: 'warning', icon: 'lucide:clock' },
  waiting:      { variant: 'warning', icon: 'lucide:clock' },
  onhold:       { variant: 'warning', icon: 'lucide:pause-circle' },
  hold:         { variant: 'warning', icon: 'lucide:pause-circle' },
  paused:       { variant: 'warning', icon: 'lucide:pause-circle' },
  draft:        { variant: 'warning', icon: 'lucide:file-edit' },
  unpaid:       { variant: 'warning', icon: 'lucide:circle-dollar-sign' },
  overdue:      { variant: 'warning', icon: 'lucide:alarm-clock' },
  expiring:     { variant: 'warning', icon: 'lucide:timer' },
  expiringsoon: { variant: 'warning', icon: 'lucide:timer' },
  low:          { variant: 'warning', icon: 'lucide:arrow-down' },
  lowstock:     { variant: 'warning', icon: 'lucide:package' },
  warning:      { variant: 'warning', icon: 'lucide:alert-triangle' },
  late:         { variant: 'warning', icon: 'lucide:alarm-clock' },
  partiallyapproved: { variant: 'warning', icon: 'lucide:check' },
  awaitingapproval:  { variant: 'warning', icon: 'lucide:clock' },

  // ── Error / Danger ─────────────────────────────────────────────────────────
  inactive:     { variant: 'danger', icon: 'lucide:circle-slash' },
  deactivated:  { variant: 'danger', icon: 'lucide:circle-slash' },
  rejected:     { variant: 'danger', icon: 'lucide:x-circle' },
  failed:       { variant: 'danger', icon: 'lucide:x-circle' },
  cancelled:    { variant: 'danger', icon: 'lucide:ban' },
  canceled:     { variant: 'danger', icon: 'lucide:ban' },
  terminated:   { variant: 'danger', icon: 'lucide:ban' },
  suspended:    { variant: 'danger', icon: 'lucide:ban' },
  blocked:      { variant: 'danger', icon: 'lucide:shield-off' },
  banned:       { variant: 'danger', icon: 'lucide:shield-off' },
  error:        { variant: 'danger', icon: 'lucide:x-circle' },
  expired:      { variant: 'danger', icon: 'lucide:calendar-x' },
  deleted:      { variant: 'danger', icon: 'lucide:trash-2' },
  archived:     { variant: 'danger', icon: 'lucide:archive' },
  disabled:     { variant: 'danger', icon: 'lucide:toggle-left' },
  void:         { variant: 'danger', icon: 'lucide:ban' },
  refunded:     { variant: 'danger', icon: 'lucide:corner-up-left' },
  outofstock:   { variant: 'danger', icon: 'lucide:package-x' },
  lost:         { variant: 'danger', icon: 'lucide:x-circle' },
  absent:       { variant: 'danger', icon: 'lucide:user-x' },
  offline:      { variant: 'danger', icon: 'lucide:wifi-off' },
  danger:       { variant: 'danger', icon: 'lucide:alert-circle' },
  declined:     { variant: 'danger', icon: 'lucide:thumbs-down' },

  // ── Neutral / Secondary ────────────────────────────────────────────────────
  new:          { variant: 'secondary', icon: 'lucide:sparkles' },
  unassigned:   { variant: 'secondary', icon: 'lucide:user-x' },
  unverified:   { variant: 'secondary', icon: 'lucide:shield' },
  unknown:      { variant: 'secondary', icon: 'lucide:help-circle' },
  notstarted:   { variant: 'secondary', icon: 'lucide:minus-circle' },
  todo:         { variant: 'secondary', icon: 'lucide:circle' },
  queued:       { variant: 'secondary', icon: 'lucide:list-ordered' },
  requested:    { variant: 'secondary', icon: 'lucide:send' },
  invited:      { variant: 'secondary', icon: 'lucide:mail' },
  default:      { variant: 'secondary' },
  none:         { variant: 'secondary' },
}

/**
 * Normalizes a status string to a canonical lookup key.
 * Strips spaces, underscores, hyphens, and lowercases the result.
 * e.g. 'In Progress' → 'inprogress', 'in_progress' → 'inprogress'
 */
export function normalizeStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/[\s_\-]+/g, '')
}

/**
 * Resolves a status string to its StatusConfig.
 * Falls back to a secondary chip with the raw label if not found.
 */
export function resolveStatus(status: string): StatusConfig {
  const key = normalizeStatus(status)
  return STATUS_MAP[key] ?? { variant: 'secondary' }
}
