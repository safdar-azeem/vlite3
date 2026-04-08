import type { ResponsiveBones, SkeletonResult } from './types'
import type { AnimationStyle } from './types'

export type RegisteredBones = SkeletonResult | ResponsiveBones

const bonesRegistry = new Map<string, RegisteredBones>()

export interface BoneyardConfig {
  color?: string
  darkColor?: string
  animate?: AnimationStyle
  stagger?: number | boolean
  transition?: number | boolean
}

let _globalConfig: BoneyardConfig = {}

export function configureSkeleton(config: BoneyardConfig): void {
  _globalConfig = { ..._globalConfig, ...config }
}

export function getGlobalConfig(): BoneyardConfig {
  return _globalConfig
}

export function registerBones(map: Record<string, RegisteredBones>): void {
  for (const [name, bones] of Object.entries(map)) {
    bonesRegistry.set(name, bones)
  }
}

export function getRegisteredBones(name: string): RegisteredBones | undefined {
  return bonesRegistry.get(name)
}

export function resolveResponsive(
  bones: RegisteredBones,
  width: number,
): SkeletonResult | null {
  if (!('breakpoints' in bones)) return bones
  const bps = Object.keys(bones.breakpoints).map(Number).sort((a, b) => a - b)
  if (bps.length === 0) return null
  const match = [...bps].reverse().find(bp => width >= bp) ?? bps[0]
  return bones.breakpoints[match] ?? null
}

// Note: The overly complex `adjustColor` function has been completely removed! 
// We now rely on pure, easily-debuggable CSS opacities inside Skeleton.vue.
