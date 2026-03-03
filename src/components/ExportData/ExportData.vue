<script setup lang="ts">
import { computed } from 'vue'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import Button from '../Button.vue'
import Modal from '../Modal.vue'
import Icon from '../Icon.vue'
import type { ExportDataProps, ExportFormat } from './types'
import { showToast } from '../../composables/useNotifications'
import { $t } from '../../utils/i18n'

const props = withDefaults(defineProps<ExportDataProps>(), {
  title: 'Export Data',
  formats: () => ['excel', 'csv', 'json'],
  buttonText: 'Export',
  buttonIcon: 'lucide:download',
  mode: 'frontend',
})

// Local helper to ensure proper fallback if translation is not setup
const t = (key: string, fallback: string, args?: Record<string, any>) => {
  const res = args ? $t(key, args) : $t(key)
  return res !== key ? res : fallback
}

const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) return undefined
  if (!path.includes('.')) return obj[path]
  return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

const availableFormats = computed(() => {
  const allFormats = [
    { label: 'Excel (.xlsx)', value: 'excel' as ExportFormat, icon: 'lucide:file-spreadsheet' },
    { label: 'CSV (.csv)', value: 'csv' as ExportFormat, icon: 'lucide:file-text' },
    { label: 'JSON (.json)', value: 'json' as ExportFormat, icon: 'lucide:file-json' },
  ]
  return allFormats.filter((f) => props.formats.includes(f.value))
})

const processDataForExport = (): any[] => {
  return props.data.map((item) => {
    const processedItem: Record<string, any> = {}

    props.fields.forEach((field) => {
      const rawValue = getNestedValue(item, field.field)

      if (field.format) {
        processedItem[field.title] = field.format(rawValue, item)
      } else {
        processedItem[field.title] = rawValue !== undefined && rawValue !== null ? rawValue : ''
      }
    })

    return processedItem
  })
}

const exportData = async (format: ExportFormat, close?: () => void) => {
  if (props.mode === 'backend' && props.onExport) {
    try {
      await props.onExport(format)
      if (close) close()
      return
    } catch (error) {
      console.error('Backend export error:', error)
      showToast(t('vlite.exportData.error', 'An error occurred while exporting data.'), 'error')
      return
    }
  }

  if (!props.data || props.data.length === 0) {
    showToast(t('vlite.exportData.noData', 'No data available to export.'), 'warning')
    return
  }

  try {
    const baseFilename = props.filename
      ? props.filename
      : `${props.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`

    const processedData = processDataForExport()

    switch (format) {
      case 'excel': {
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(processedData)
        XLSX.utils.book_append_sheet(workbook, worksheet, props.title.substring(0, 31))
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(blob, `${baseFilename}.xlsx`)
        break
      }
      case 'csv': {
        const UTF8_BOM = '\uFEFF'
        const csv = Papa.unparse(processedData)
        const blob = new Blob([UTF8_BOM + csv], { type: 'text/csv;charset=utf-8;' })
        saveAs(blob, `${baseFilename}.csv`)
        break
      }
      case 'json': {
        const jsonString = JSON.stringify(processedData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        saveAs(blob, `${baseFilename}.json`)
        break
      }
    }

    showToast(
      t('vlite.exportData.success', `Data exported successfully as ${format.toUpperCase()}`, {
        format: format.toUpperCase(),
      }),
      'success'
    )
    if (close) close()
  } catch (error) {
    console.error('Export error:', error)
    showToast(t('vlite.exportData.error', 'An error occurred while exporting data.'), 'error')
  }
}

const txtSelectFormat = computed(() => t('vlite.exportData.selectFormat', 'Select Export Format'))

defineExpose({
  exportData,
  availableFormats,
})
</script>

<template>
  <div>
    <Button
      v-if="formats.length === 1"
      :text="buttonText"
      :icon="buttonIcon"
      variant="outline"
      @click="exportData(formats[0])" />

    <Modal v-else :title="title" max-width="sm:max-w-[400px]">
      <template #trigger>
        <Button :text="buttonText" :icon="buttonIcon" variant="outline" />
      </template>

      <template #default="{ close }">
        <div class="px-1 py-1 text-sm">
          <h6 class="font-medium mb-3 text-muted-foreground">{{ txtSelectFormat }}</h6>
          <div class="space-y-3">
            <Button
              v-for="format in availableFormats"
              :key="format.value"
              variant="outline"
              class="w-full flex items-center justify-start gap-3 h-12"
              @click="exportData(format.value, close)">
              <Icon :icon="format.icon" class="text-muted-foreground h-5 w-5" />
              <span>{{ format.label }}</span>
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
