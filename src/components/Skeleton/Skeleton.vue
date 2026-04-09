<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { normalizeBone } from './types'
import type { AnyBone, SkeletonResult, ResponsiveBones, SkeletonProps } from './types'
import { getRegisteredBones, resolveResponsive, getGlobalConfig } from './shared'
import { snapshotBones } from './extract'

// ============================================================================
// 🛠️ SKELETON CONFIGURATION (EASY TO EDIT & DEBUG)
// Change these values manually to tweak the exact skeleton appearance!
// ============================================================================

// 1. Base colors for the bones
const BASE_COLOR_LIGHT = 'rgba(0, 0, 0, 0.03)'
const BASE_COLOR_DARK = 'rgba(255, 255, 255, 0.05)'

// 2. Static Opacities
const CONTAINER_BONE_OPACITY = 0.4 // Makes background "container" bones fainter
const STANDARD_BONE_OPACITY = 1.0 // Standard foreground bones are fully opaque

// 3. Pulse Animation Opacities
const PULSE_PEAK_OPACITY = 1.0
const PULSE_END_OPACITY = 0.1 // <--- Reduced end opacity as requested!

// 4. Shimmer Animation Overlay Colors
// We use pure RGB strings here to build clean gradients without muddy greys
const SHIMMER_RGB_LIGHT = '0, 0, 0'
const SHIMMER_RGB_DARK = '255, 255, 255'
const SHIMMER_PEAK_ALPHA = '0.04' // How dark/light the moving shimmer wave is
const SHIMMER_END_ALPHA = '0' // The transparent edges of the wave

// ============================================================================

const props = withDefaults(defineProps<SkeletonProps>(), {
  animate: 'pulse',
  auto: false,
})

const containerRef = ref<HTMLElement | null>(null)
const fixtureRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)
const isDark = ref(false)
const uid = Math.random().toString(36).slice(2, 8)

const dynamicBones = shallowRef<SkeletonResult | null>(null)

const globalConfig = getGlobalConfig()

const rawAnimate = computed(() => props.animate ?? globalConfig.animate ?? 'pulse')
const animationStyle = computed<'pulse' | 'shimmer' | 'solid'>(() => {
  const v = rawAnimate.value
  return v === true ? 'pulse' : v === false ? 'solid' : v
})

const resolvedColor = computed(() =>
  isDark.value
    ? (props.darkColor ?? globalConfig.darkColor ?? BASE_COLOR_DARK)
    : (props.color ?? globalConfig.color ?? BASE_COLOR_LIGHT)
)

const effectiveBones = computed(
  () =>
    dynamicBones.value ??
    props.initialBones ??
    (props.name ? getRegisteredBones(props.name) : undefined)
)

const viewportWidth = computed(() =>
  typeof window !== 'undefined' ? window.innerWidth : containerWidth.value
)

const activeBones = computed(() =>
  effectiveBones.value && (viewportWidth.value > 0 || containerWidth.value > 0)
    ? resolveResponsive(effectiveBones.value, viewportWidth.value || containerWidth.value)
    : null
)

const staggerMs = computed(() => {
  const v = props.stagger ?? globalConfig.stagger
  return v === true ? 80 : v === false || !v ? 0 : v
})

const transitionMs = computed(() => {
  const v = props.transition ?? globalConfig.transition
  return v === true ? 300 : v === false || !v ? 0 : v
})

const transitioning = ref(false)
let transitionTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.loading,
  (newVal, oldVal) => {
    if (oldVal && !newVal && transitionMs.value > 0 && activeBones.value) {
      if (transitionTimer) clearTimeout(transitionTimer)
      transitioning.value = true
      transitionTimer = setTimeout(() => {
        transitioning.value = false
        transitionTimer = null
      }, transitionMs.value)
    }

    if (newVal && props.auto) {
      captureDynamicBones()
    }
  },
  { immediate: true }
)

const showSkeleton = computed(() => (props.loading || transitioning.value) && !!activeBones.value)
const showFallback = computed(
  () => props.loading && !activeBones.value && !transitioning.value && !props.auto
)

const effectiveHeight = computed(() =>
  containerHeight.value > 0 ? containerHeight.value : (activeBones.value?.height ?? 0)
)
const capturedHeight = computed(() => activeBones.value?.height ?? 0)
const scaleY = computed(() =>
  effectiveHeight.value > 0 && capturedHeight.value > 0
    ? effectiveHeight.value / capturedHeight.value
    : 1
)

function captureDynamicBones() {
  nextTick(() => {
    requestAnimationFrame(() => {
      if (fixtureRef.value) {
        dynamicBones.value = snapshotBones(
          fixtureRef.value,
          props.name || 'auto-skeleton',
          props.snapshotConfig
        )
      }
    })
  })
}

function updateDarkMode() {
  if (typeof window === 'undefined') return
  try {
    isDark.value =
      document.documentElement.classList.contains('dark') || !!containerRef.value?.closest('.dark')
  } catch {
    isDark.value = false
  }
}

function sanitizeRadius(r: number | string): string {
  if (typeof r === 'number') return `${r}px`
  if (
    /^[0-9.]+(%|px|em|rem)?(\s+[0-9.]+(%|px|em|rem)?)*(\s*\/\s*[0-9.]+(%|px|em|rem)?(\s+[0-9.]+(%|px|em|rem)?)*)?$/.test(
      r
    )
  )
    return r
  return '0px'
}

// We now use two nested divs. Outer controls positioning/stagger. Inner controls color/opacity.
function getOuterWrapperStyle(raw: AnyBone, scale: number, index: number) {
  const bone = normalizeBone(raw)
  const radius = sanitizeRadius(bone.r)

  return {
    position: 'absolute' as const,
    left: `${bone.x}%`,
    top: `${bone.y * scale}px`,
    width: `${bone.w}%`,
    height: `${bone.h * scale}px`,
    borderRadius: radius,
    overflow: 'hidden',
    // Start invisible if staggering, otherwise visible
    opacity: staggerMs.value > 0 ? 0 : 1,
    animation:
      staggerMs.value > 0
        ? `by-${uid} 0.3s ease-out ${index * staggerMs.value}ms forwards`
        : 'none',
  }
}

function getInnerBoneStyle(raw: AnyBone, color: string) {
  const bone = normalizeBone(raw)
  return {
    width: '100%',
    height: '100%',
    backgroundColor: color,
    opacity: bone.c ? CONTAINER_BONE_OPACITY : STANDARD_BONE_OPACITY,
    position: 'relative' as const,
  }
}

function getOverlayStyle(dark: boolean, anim: 'pulse' | 'shimmer') {
  if (anim === 'pulse') {
    const rgb = dark ? SHIMMER_RGB_DARK : SHIMMER_RGB_LIGHT
    return {
      position: 'absolute' as const,
      inset: 0,
      backgroundColor: `rgba(${rgb}, ${SHIMMER_PEAK_ALPHA})`,
      animation: `bp-${uid} 1.8s ease-in-out infinite`,
    }
  }

  if (anim === 'shimmer') {
    const rgb = dark ? SHIMMER_RGB_DARK : SHIMMER_RGB_LIGHT
    const gradient = `linear-gradient(90deg, rgba(${rgb}, ${SHIMMER_END_ALPHA}) 0%, rgba(${rgb}, ${SHIMMER_PEAK_ALPHA}) 50%, rgba(${rgb}, ${SHIMMER_END_ALPHA}) 100%)`
    return {
      position: 'absolute' as const,
      inset: 0,
      background: gradient,
      // Using transform: translateX entirely fixes the ugly snapping at 100%
      animation: `bs-${uid} 2.5s infinite ease-in-out`,
    }
  }
  return {}
}

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let mqHandler: (() => void) | null = null
let mq: MediaQueryList | null = null

onMounted(() => {
  updateDarkMode()

  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    containerWidth.value = Math.round(rect.width)
    if (rect.height > 0) containerHeight.value = Math.round(rect.height)
  }

  mq = window.matchMedia('(prefers-color-scheme: dark)')
  mqHandler = () => updateDarkMode()
  mq.addEventListener('change', mqHandler)

  mutationObserver = new MutationObserver(updateDarkMode)
  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0]?.contentRect
    containerWidth.value = Math.round(rect?.width ?? 0)
    if (rect && rect.height > 0) containerHeight.value = Math.round(rect.height)
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (mq && mqHandler) mq.removeEventListener('change', mqHandler)
  mutationObserver?.disconnect()
  resizeObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" :class="props.class" style="position: relative" :data-boneyard="name">
    <div
      data-boneyard-content="true"
      :style="{ visibility: showSkeleton && !transitioning ? 'hidden' : undefined }">
      <template v-if="showFallback">
        <slot name="fallback" />
      </template>
      <template v-else>
        <slot />
      </template>
    </div>

    <div
      v-if="loading && auto && !dynamicBones"
      data-boneyard-fixture
      ref="fixtureRef"
      style="position: absolute; inset: 0; z-index: -1; opacity: 0.001; pointer-events: none"
      aria-hidden="true">
      <slot name="fixture">
        <slot />
      </slot>
    </div>

    <div
      v-if="showSkeleton && activeBones"
      data-boneyard-overlay="true"
      :style="`position:absolute;inset:0;overflow:hidden;opacity:${transitioning ? 0 : 1};${transitionMs > 0 ? `transition:opacity ${transitionMs}ms ease-out;` : ''}pointer-events:none;will-change:opacity;contain:strict;`">
      <div style="position: relative; width: 100%; height: 100%">
        <div
          v-for="(bone, i) in activeBones.bones"
          :key="`${i}-${(bone as any).x ?? (bone as any)[0]}`"
          v-memo="[bone, scaleY, resolvedColor, animationStyle, isDark, staggerMs]"
          data-boneyard-bone="true"
          :style="getOuterWrapperStyle(bone, scaleY, i)">
          <div :style="getInnerBoneStyle(bone, resolvedColor)">
            <div
              v-if="animationStyle !== 'solid'"
              :style="getOverlayStyle(isDark, animationStyle)" />
          </div>
        </div>

        <component v-if="animationStyle === 'pulse'" :is="'style'" v-once>
          @keyframes bp-{{ uid }} { 0%, 100% { opacity: {{ PULSE_END_OPACITY }}; } 50% { opacity:
          {{ PULSE_PEAK_OPACITY }}; } }
        </component>

        <component v-if="animationStyle === 'shimmer'" :is="'style'" v-once>
          @keyframes bs-{{ uid }} { 0% { transform: translateX(-100%); } 100% { transform:
          translateX(100%); } }
        </component>

        <component v-if="staggerMs > 0" :is="'style'" v-once>
          @keyframes by-{{ uid }} { from { opacity: 0; } to { opacity: 1; } }
        </component>
      </div>
    </div>
  </div>
</template>
