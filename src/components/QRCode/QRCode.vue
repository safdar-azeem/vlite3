<script setup lang="ts">
import { computed } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'

export interface QRCodeProps {
  value?: string
  imageUrl?: string
  size?: number | string
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
}

const props = withDefaults(defineProps<QRCodeProps>(), {
  size: 200,
  margin: 4,
})

const textRef = computed(() => props.value || '')

const qrcode = useQRCode(textRef, {
  margin: props.margin,
  color: props.color,
})

const finalSrc = computed(() => {
  if (props.imageUrl) return props.imageUrl
  if (props.value) return qrcode.value
  return ''
})

const containerStyle = computed(() => {
  const sizeStr = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: sizeStr,
    height: sizeStr,
  }
})
</script>

<template>
  <div class="inline-flex justify-center items-center max-w-full" :style="containerStyle">
    <img
      v-if="finalSrc"
      :src="finalSrc"
      alt="QR Code"
      class="w-full h-full object-contain pointer-events-none" />
  </div>
</template>
