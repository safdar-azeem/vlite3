<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '../../Modal.vue'
import ExportData from '../../ExportData/ExportData.vue'
import Button from '../../Button.vue'
import Icon from '../../Icon.vue'
import { $t } from '@/utils/i18n'

const props = defineProps<{
  show: boolean
  data: any[]
  fields: any[]
  mode: 'frontend' | 'backend'
  exportProps: any
  onExport: (format: string) => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()

const exportDataRef = ref<any>(null)

const txtExportData = computed(() => {
  const r = $t('vlite.screen.exportData')
  return r !== 'vlite.screen.exportData' ? r : 'Export Data'
})

const txtSelectFormat = computed(() => {
  const r = $t('vlite.exportData.selectFormat')
  return r !== 'vlite.exportData.selectFormat' ? r : 'Select Export Format'
})
</script>

<template>
  <Modal
    :show="show"
    @update:show="emit('update:show', $event)"
    :title="txtExportData"
    max-width="sm:max-w-[400px]">
    <template #default="{ close }">
      <ExportData
        ref="exportDataRef"
        :data="data || []"
        :fields="fields"
        :mode="mode"
        :on-export="onExport"
        v-bind="typeof exportProps === 'object' ? exportProps : {}"
        :title="txtExportData"
        class="hidden!" />
      <div class="px-1 py-1 text-sm">
        <h6 class="font-medium mb-3 text-muted-foreground">
          {{ txtSelectFormat }}
        </h6>
        <div class="space-y-3">
          <Button
            v-for="format in exportDataRef?.availableFormats || [
              { value: 'excel', label: 'Excel (.xlsx)', icon: 'lucide:file-spreadsheet' },
              { value: 'csv', label: 'CSV (.csv)', icon: 'lucide:file-text' },
              { value: 'json', label: 'JSON (.json)', icon: 'lucide:file-json' },
            ]"
            :key="format.value"
            variant="outline"
            class="w-full flex items-center justify-start gap-3 h-12"
            @click="exportDataRef?.exportData(format.value, close)">
            <Icon :icon="format.icon" class="text-muted-foreground h-5 w-5" />
            <span>{{ format.label }}</span>
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
