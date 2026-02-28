<script setup lang="ts">
import { computed } from 'vue'
import { ButtonRounded, ButtonSize, ButtonVariant } from '@/types'
import { useTheme } from '../composables/useTheme'
import Button from './Button.vue'
import { $t } from '@/utils/i18n'

const props = defineProps<{
  class?: string
  rounded?: ButtonRounded
  size?: ButtonSize
  variant?: ButtonVariant
}>()

const { theme, toggleTheme } = useTheme()

const titleText = computed(() => {
  const isLight = theme.value === 'light'
  const lightKey = 'vlite.themeToggle.switchToDark'
  const darkKey = 'vlite.themeToggle.switchToLight'
  
  if (isLight) {
    const res = $t(lightKey)
    return res !== lightKey ? res : 'Switch to dark mode'
  } else {
    const res = $t(darkKey)
    return res !== darkKey ? res : 'Switch to light mode'
  }
})
</script>

<template>
  <slot :toggleTheme="toggleTheme" :theme="theme">
    <Button
      :icon="theme === 'light' ? 'lucide:sun' : 'lucide:moon'"
      :variant="variant || 'secondary'"
      :rounded="rounded || 'md'"
      :size="size"
      :class="class"
      :title="titleText"
      @click="toggleTheme" />
  </slot>
</template>

