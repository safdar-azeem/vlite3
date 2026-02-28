<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'

interface Props {
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'lucide:inbox',
})

const displayTitle = computed(() => {
  if (props.titleI18n) return $t(props.titleI18n)
  if (props.title) return props.title
  const res = $t('vlite.empty.title')
  return res !== 'vlite.empty.title' ? res : 'No data found'
})

const displayDescription = computed(() => {
  if (props.descriptionI18n) return $t(props.descriptionI18n)
  if (props.description) return props.description
  const res = $t('vlite.empty.description')
  return res !== 'vlite.empty.description' ? res : 'There is nothing to display here right now.'
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center py-28 gap-5 rounded-3xl border border-gray-150 bg-muted/50 w-full mt-4">
    <div
      class="w-17 h-17 rounded-full bg-gray-200/60 border border-gray-250 shadow-inner flex items-center justify-center">
      <Icon :icon="icon" class="w-7 h-7 text-muted-foreground" stroke-width="1.2" />
    </div>
    <div class="text-center space-y-1">
      <h3 class="text-fs-5 font-semibold text-foreground tracking-tight">
        {{ displayTitle }}
      </h3>
      <p class="text-sm text-gray-700 font-light leading-relaxed" v-html="displayDescription"></p>
    </div>
    <slot name="action" />
    <slot />
  </div>
</template>

