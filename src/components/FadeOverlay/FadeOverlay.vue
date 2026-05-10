<script setup lang="ts">
import { computed } from 'vue'
import type { FadeOverlayProps } from './types'
import { parsePct, buildGradient, DIR_TO_CSS, sizeStyles } from './utils'

const props = withDefaults(defineProps<FadeOverlayProps>(), {
  direction: 'bottom',
  coverage: '100%',
  fadeStart: '0%',
  fadeEnd: '100%',
  color: 'var(--color-background)',
  easing: 'smooth',
  opacity: 1,
  zIndex: 10,
  tintOpacity: 0,
})

const isBlurMode = computed(() => props.blur !== undefined && props.blur !== null)

const blurCSS = computed((): string => {
  if (!isBlurMode.value) return ''
  if (typeof props.blur === 'number') return `${props.blur}px`
  const s = String(props.blur).trim()
  return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s
})

const overlayStyles = computed(() => {
  const coverageVal =
    typeof props.coverage === 'number' ? `${props.coverage}%` : (props.coverage as string)

  const startPct = parsePct(props.fadeStart)
  const endPct = parsePct(props.fadeEnd)
  const cssDir = DIR_TO_CSS[props.direction]

  const base: Record<string, string | number> = {
    position: 'absolute',
    pointerEvents: 'none',
    borderRadius: 'inherit',
    opacity: props.opacity,
    zIndex: props.zIndex,
    ...sizeStyles(props.direction, coverageVal),
    ...(props.blendMode ? { mixBlendMode: props.blendMode } : {}),
  }

  if (isBlurMode.value) {
    const tintPct = Math.round(props.tintOpacity * 100)
    const tintBg =
      tintPct > 0 ? `color-mix(in srgb, ${props.color} ${tintPct}%, transparent)` : 'transparent'

    const maskGradient = buildGradient(cssDir, 'black', startPct, endPct, props.easing)

    return {
      ...base,
      background: tintBg,
      backdropFilter: `blur(${blurCSS.value})`,
      WebkitBackdropFilter: `blur(${blurCSS.value})`,
      maskImage: maskGradient,
      WebkitMaskImage: maskGradient,
    }
  }

  return {
    ...base,
    background: buildGradient(cssDir, props.color, startPct, endPct, props.easing),
  }
})
</script>

<template>
  <div :style="overlayStyles" aria-hidden="true" class="vlite-fade-overlay" />
</template>
