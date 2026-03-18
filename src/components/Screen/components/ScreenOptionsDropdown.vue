<script setup lang="ts">
import { computed } from 'vue'
import Button from '../../Button.vue'
import Dropdown from '../../Dropdown/Dropdown.vue'
import { $t } from '@/utils/i18n'

const props = defineProps<{
  exportProps?: Record<string, any> | boolean
  importProps?: Record<string, any> | boolean
}>()

const emit = defineEmits<{
  (e: 'select', payload: any): void
}>()

const txtExportData = computed(() => {
  const r = $t('vlite.screen.exportData')
  return r !== 'vlite.screen.exportData' ? r : 'Export Data'
})
const txtImportData = computed(() => {
  const r = $t('vlite.screen.importData')
  return r !== 'vlite.screen.importData' ? r : 'Import Data'
})

const dropdownOptions = computed(() => {
  const opts = []
  if (props.exportProps !== false)
    opts.push({ value: 'export', label: txtExportData.value, icon: 'lucide:download' })
  if (props.importProps !== false)
    opts.push({ value: 'import', label: txtImportData.value, icon: 'lucide:upload' })
  return opts
})
</script>

<template>
  <Dropdown
    closeOnSelect
    position="bottom-end"
    :options="dropdownOptions"
    @on-select="emit('select', $event)">
    <template #trigger>
      <Button
        variant="outline"
        icon="lucide:more-vertical"
        class="px-2!"
        :title="
          $t('vlite.screen.moreOptions') !== 'vlite.screen.moreOptions'
            ? $t('vlite.screen.moreOptions')
            : 'More Options'
        " />
    </template>
  </Dropdown>
</template>
