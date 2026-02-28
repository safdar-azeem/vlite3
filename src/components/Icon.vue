<script setup lang="ts">
import { computed } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    icon?: string
    emoji?: string
  }>(),
  {
    icon: '',
    emoji: '',
  }
)

const isLink = computed(() => {
  if (!props.icon) return false

  // Check for URL
  if (props.icon.startsWith('http://') || props.icon.startsWith('https://')) {
    return true
  }

  // Check for data URI (base64 images)
  if (props.icon.startsWith('data:image/')) {
    return true
  }

  // Check for local paths that look like images (relative or absolute)
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.avif']
  return imageExtensions.some((ext) => props.icon.toLowerCase().endsWith(ext))
})
</script>

<template>
  <span v-if="emoji" v-bind="$attrs" class="inline-flex items-center justify-center font-normal">{{ emoji }}</span>
  <img
    v-else-if="icon && isLink"
    :src="icon"
    v-bind="$attrs"
    alt="icon"
    class="rounded-full scale-105" />
  <IconifyIcon v-else-if="icon" :icon="icon" v-bind="$attrs" />
</template>
