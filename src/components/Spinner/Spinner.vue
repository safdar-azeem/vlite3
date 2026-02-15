<script setup lang="ts">
import { computed } from 'vue'
import type { SpinnerProps, SpinnerSize, SpinnerColor, SpinnerVariant } from './types'

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  color: 'current',
  variant: 'border',
  class: '',
})

const sizeClasses = computed(() => {
  const sizes: Record<SpinnerSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  if (props.color === 'current') return 'text-current'

  const colors: Record<Exclude<SpinnerColor, 'current'>, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
    white: 'text-white',
  }
  return colors[props.color as Exclude<SpinnerColor, 'current'>]
})

</script>

<template>
  <span :class="[colorClasses,sizeClasses]">
    <svg v-if="variant=='dots'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g><circle cx="3" cy="12" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="21" cy="12" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="12" cy="21" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="12" cy="3" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="5.64" cy="5.64" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="18.36" cy="18.36" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="5.64" cy="18.36" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><circle cx="18.36" cy="5.64" r="2" fill="currentColor" stroke-width="0.3" stroke="currentColor"/><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g></svg>


  <svg v-if="variant==='border'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25" stroke-width="0.3" stroke="currentColor"/><path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" stroke-width="0.3" stroke="currentColor"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>


  <svg v-if="variant==='bars'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.14" stroke-width="0.3" stroke="currentColor"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.29" transform="rotate(30 12 12)" stroke-width="0.3" stroke="currentColor"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.43" transform="rotate(60 12 12)" stroke-width="0.3" stroke="currentColor"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.57" transform="rotate(90 12 12)" stroke-width="0.3" stroke="currentColor"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.71" transform="rotate(120 12 12)" stroke-width="0.3" stroke="currentColor"/><rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.86" transform="rotate(150 12 12)" stroke-width="0.3" stroke="currentColor"/><rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)" stroke-width="0.3" stroke="currentColor"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>

  <svg v-if="variant=='ping'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><circle cx="12" cy="12" r="0" fill="currentColor" stroke-width="0.3" stroke="currentColor"><animate id="SVG0cdVlcnN" fill="freeze" attributeName="r" begin="0;SVGftllRbIv.begin+0.6s" calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="0;11"/><animate fill="freeze" attributeName="opacity" begin="0;SVGftllRbIv.begin+0.6s" calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="1;0"/></circle><circle cx="12" cy="12" r="0" fill="currentColor" stroke-width="0.3" stroke="currentColor"><animate id="SVGftllRbIv" fill="freeze" attributeName="r" begin="SVG0cdVlcnN.begin+0.6s" calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="0;11"/><animate fill="freeze" attributeName="opacity" begin="SVG0cdVlcnN.begin+0.6s" calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="1;0"/></circle></svg>
  </span>
</template>
