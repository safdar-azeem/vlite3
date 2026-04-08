export interface SnapshotConfig {
  /**
   * HTML tags always captured as a single atomic bone, regardless of children.
   * Default: ['p','h1','h2','h3','h4','h5','h6','li','tr']
   */
  leafTags?: string[]

  /**
   * When true, containers with a visible border AND border-radius are captured
   * as container bones — even with a white or transparent background.
   * Default: true
   */
  captureRoundedBorders?: boolean

  /**
   * HTML tags to skip entirely — no bone emitted, children not walked.
   */
  excludeTags?: string[]

  /**
   * CSS selectors to skip entirely.
   */
  excludeSelectors?: string[]
}

/** A single skeleton bone */
export interface Bone {
  x: number
  y: number
  w: number
  h: number
  r: number | string
  /** True if this bone is a background container */
  c?: boolean
}

/** Compact bone format */
export type CompactBone = [number, number, number, number, number | string] | [number, number, number, number, number | string, boolean]

export type AnyBone = Bone | CompactBone

export function normalizeBone(b: AnyBone): Bone {
  if (Array.isArray(b)) {
    return { x: b[0], y: b[1], w: b[2], h: b[3], r: b[4], c: b[5] || undefined }
  }
  return b
}

export interface SkeletonResult {
  name: string
  viewportWidth: number
  width: number
  height: number
  bones: Bone[]
}

export interface ResponsiveBones {
  breakpoints: Record<number, SkeletonResult>
}

export type AnimationStyle = 'pulse' | 'shimmer' | 'solid' | boolean

export interface SkeletonProps {
  loading: boolean
  name?: string
  initialBones?: SkeletonResult | ResponsiveBones
  auto?: boolean
  color?: string
  darkColor?: string
  animate?: AnimationStyle
  stagger?: number | boolean
  transition?: number | boolean
  class?: string
  snapshotConfig?: SnapshotConfig
}
