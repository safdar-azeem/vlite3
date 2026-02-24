<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import Button from './Button.vue'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <slot :toggleTheme="toggleTheme" :theme="theme">
    <Button
      :icon="theme === 'light' ? 'lucide:sun' : 'lucide:moon'"
      variant="secondary"
      :title="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
      @click="toggleTheme" />
  </slot>
</template>
