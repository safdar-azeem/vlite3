<script setup lang="ts">
import { ref, computed } from 'vue'
import Papa from 'papaparse'
import Icon from '../Icon.vue'
import Button from '../Button.vue'
import Textarea from '../Textarea.vue'
import type { ImportField } from './types'
import { showToast } from '../../composables/useNotifications'
import { $t } from '../../utils/i18n'
import { camelCase } from '../../utils/functions'

const props = defineProps<{
  importMethod: string
  csvFile: File | null
  headers: string[]
  fields: ImportField[]
  preview: any[]
  importData: any[]
}>()

const emits = defineEmits([
  'update:importMethod', 
  'update:csvFile', 
  'update:mappings', 
  'update:headers',
  'update:preview',
  'update:importData',
  'next'
])

const t = (key: string, fallback: string, args?: Record<string, any>) => {
  const res = args ? $t(key, args) : $t(key)
  return res !== key ? res : fallback
}

const fileInput = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const pasteTextarea = ref('')

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  dragActive.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0]
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      handleFileUpload(file)
    } else {
      showToast(t('vlite.importData.csvOnly', 'Please upload a CSV file'), 'error')
    }
  }
}

const handleFileUpload = (file: File) => {
  emits('update:csvFile', file)
  emits('update:importMethod', 'file')
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) processCSVData(e.target.result as string)
  }
  reader.readAsText(file)
}

const handlePaste = () => {
  emits('update:importMethod', 'paste')
  if (pasteTextarea.value) processCSVData(pasteTextarea.value)
}

const findMatchingField = (header: string) => {
  const normalizedHeader = camelCase(header).replace(/\s+/g, '')
  const directMatches: Record<string, string> = {}

  props.fields.forEach((field) => {
    directMatches[camelCase(field.field)] = field.field
    field.matchings?.forEach((matching) => {
      directMatches[camelCase(matching)] = field.field
    })
  })

  return directMatches[normalizedHeader] || ''
}

const processCSVData = (content: string) => {
  try {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (!result.data || result.data.length === 0) {
          showToast(t('vlite.importData.emptyCsv', 'The CSV file is empty.'), 'warning')
          return
        }

        const parsedHeaders = Object.keys(result.data[0] as object)
        emits('update:headers', parsedHeaders)

        const mappedData = result.data.map((item: any) => {
          const newItem: Record<string, any> = {}
          Object.keys(item).forEach((key) => {
            newItem[key] = item[key] || props.fields.find((f) => f.field === key)?.defaultValue
          })
          return newItem
        })

        emits('update:importData', mappedData)
        emits('update:preview', result.data.slice(0, 3))

        const initialMappings: Record<string, string> = {}
        parsedHeaders.forEach((header) => {
          const matchedField = findMatchingField(header)
          initialMappings[header] = matchedField || ''
        })

        emits('update:mappings', initialMappings)
        emits('next')
      },
      error: (error: any) =>
        showToast(
          t('vlite.importData.parseError', 'Failed to parse CSV: ') + error.message,
          'error'
        ),
    })
  } catch (error) {
    showToast(t('vlite.importData.processError', 'Error processing CSV data'), 'error')
    console.error(error)
  }
}

const handleFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    handleFileUpload(target.files[0])
  }
}

const txtUpload = computed(() => t('vlite.importData.uploadData', 'Upload Data'))
const txtDragDrop = computed(() => t('vlite.importData.dragDrop', 'Drag & drop a file here or click to browse'))
const txtCsvOnlyHint = computed(() => t('vlite.importData.csvOnlyHint', 'Only CSV files are supported'))
const txtPasteData = computed(() => t('vlite.importData.pasteData', 'Or paste CSV/Excel data'))
const txtProcess = computed(() => t('vlite.importData.process', 'Process Data'))
const txtPastePlaceholder = computed(() => t('vlite.importData.pastePlaceholder', 'id, name, email\n1, John Doe, john@example.com'))
</script>

<template>
  <div class="space-y-2">
    <h5 class="font-medium text-md">{{ txtUpload }}</h5>

    <div class="space-y-6">
      <div
        :class="[
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          importMethod === 'file'
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50',
          dragActive ? 'border-primary bg-primary/10 scale-[1.01]' : '',
        ]"
        @click="fileInput?.click()"
        @dragover.prevent="dragActive = true"
        @dragleave.prevent="dragActive = false"
        @drop="handleDrop">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".csv"
          @change="handleFileInputChange" />
        <div class="flex flex-col items-center justify-center pointer-events-none">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <Icon icon="lucide:upload-cloud" class="w-6 h-6" />
          </div>
          <p class="font-medium text-foreground mb-1">{{ txtDragDrop }}</p>
          <p class="text-sm text-muted-foreground">{{ txtCsvOnlyHint }}</p>
          <p
            v-if="csvFile"
            class="mt-4 text-sm font-semibold text-primary bg-background px-3 py-1 rounded-md border border-border shadow-sm inline-block">
            {{ csvFile.name }} ({{ (csvFile.size / 1024).toFixed(2) }} KB)
          </p>
        </div>
      </div>

      <div
        :class="[
          'border rounded-xl p-6 transition-colors',
          importMethod === 'paste'
            ? 'border-primary shadow-sm ring-1 ring-primary/20'
            : 'border-border',
        ]">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground">
            <Icon icon="lucide:clipboard-paste" class="w-4 h-4" />
          </div>
          <div>
            <p class="font-medium text-foreground leading-none">{{ txtPasteData }}</p>
          </div>
        </div>
        
        <Textarea
          v-model="pasteTextarea"
          class="w-full h-32"
          :placeholder="txtPastePlaceholder"
        />
        
        <div class="flex justify-end mt-3">
          <Button variant="secondary" size="sm" @click="handlePaste" :disabled="!pasteTextarea">
            {{ txtProcess }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
