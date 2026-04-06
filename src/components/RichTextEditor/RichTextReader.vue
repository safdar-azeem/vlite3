<script setup lang="ts">
import './rich-text-typography.css'

interface Props {
  content?: string
}

withDefaults(defineProps<Props>(), {
  content: '',
})
</script>

<template>
  <div class="rte-reader">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="rte-content" v-html="content"></div>
  </div>
</template>

<style scoped>
.rte-reader {
  font-family: inherit;
  color: var(--color-foreground);
  font-size: 0.9rem;
  line-height: 1.7;
  word-break: break-word;
  overflow-wrap: break-word;
  padding: 0;
  margin: 0;
}
</style>
