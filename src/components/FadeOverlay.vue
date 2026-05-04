<script setup lang="ts">
import { computed } from 'vue'

export interface FadeOverlayProps {
  direction?: 'top' | 'bottom' | 'left' | 'right'
  coverage?: string | number
  fadeStart?: string | number
  fadeEnd?: string | number
  blur?: boolean | string | number
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'
  opacity?: string | number
  zIndex?: string | number
  color?: string
}

const props = withDefaults(defineProps<FadeOverlayProps>(), {
  direction: 'bottom',
  coverage: '20%',
  fadeStart: '0%',
  fadeEnd: '100%',
  color: 'var(--color-background)',
})

const positionStyles = computed(() => {
  const coverageValue = typeof props.coverage === 'number' ? `${props.coverage}%` : props.coverage
  const start = typeof props.fadeStart === 'number' ? `${props.fadeStart}%` : props.fadeStart
  const end = typeof props.fadeEnd === 'number' ? `${props.fadeEnd}%` : props.fadeEnd
  
  const blurValue = typeof props.blur === 'boolean' ? (props.blur ? '8px' : '') : (typeof props.blur === 'number' ? `${props.blur}px` : props.blur)

  const baseStyles: Record<string, string | number> = {
    opacity: props.opacity ?? 1,
    zIndex: props.zIndex ?? 10,
    mixBlendMode: props.blendMode as any
  }

  // If blur is enabled and color is default, we make the background translucent 
  // so the blur effect is visible beneath it.
  const finalColor = blurValue && props.color === 'var(--color-background)' 
    ? 'color-mix(in srgb, var(--color-background) 50%, transparent)' 
    : props.color

  const dirMap: Record<string, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  }
  const dir = dirMap[props.direction!] || 'to bottom'

  const sizeStyles = (props.direction === 'top' || props.direction === 'bottom')
    ? { left: 0, right: 0, height: coverageValue, [props.direction!]: 0 }
    : { top: 0, bottom: 0, width: coverageValue, [props.direction!]: 0 }

  if (blurValue) {
    // For blur, we apply the blur and background to the whole element,
    // and use mask-image to fade them both out.
    const maskGradient = `transparent ${start}, black ${end}`
    return {
      ...baseStyles,
      ...sizeStyles,
      background: finalColor,
      backdropFilter: `blur(${blurValue})`,
      WebkitBackdropFilter: `blur(${blurValue})`,
      maskImage: `linear-gradient(${dir}, ${maskGradient})`,
      WebkitMaskImage: `linear-gradient(${dir}, ${maskGradient})`
    }
  }

  // Normal gradient fade
  const bgGradient = `transparent ${start}, ${finalColor} ${end}`
  
  return {
    ...baseStyles,
    ...sizeStyles,
    background: `linear-gradient(${dir}, ${bgGradient})`
  }
})
</script>

<template>
</template>
