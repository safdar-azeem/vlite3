<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/Button.vue'
import { $t } from '@/utils/i18n'

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const titleText = computed(() => {
  const res = $t('vlite.workbook.addSheet')
  return res !== 'vlite.workbook.addSheet' ? res : 'Add New Sheet'
})
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    icon="lucide:plus"
    :title="titleText"
    rounded="none"
    @click="emit('click', $event)" />
</template>

