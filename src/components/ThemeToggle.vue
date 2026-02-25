<script setup lang="ts">
import { ButtonRounded, ButtonSize, ButtonVariant } from '@/types'
import { useTheme } from '../composables/useTheme'
import Button from './Button.vue'

const props = defineProps<{
  class?: string
  rounded?: ButtonRounded
  size?: ButtonSize
  variant?: ButtonVariant
}>()

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <slot :toggleTheme="toggleTheme" :theme="theme">
    <Button
      :icon="theme === 'light' ? 'lucide:sun' : 'lucide:moon'"
      :variant="variant || 'secondary'"
      :rounded="rounded || 'md'"
      :size="size"
      :class="class"
      :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
      @click="toggleTheme" />
  </slot>
</template>
