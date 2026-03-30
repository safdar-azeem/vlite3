<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import Modal from '../Modal.vue'
import Button from '../Button.vue'
import { Timeline } from '../Timeline'
import ImportStep1 from './ImportStep1.vue'
import ImportStep2 from './ImportStep2.vue'
import ImportStep3 from './ImportStep3.vue'
import ImportStep4 from './ImportStep4.vue'
import type { ImportDataProps, ImportOptions, ImportProgress } from './types'
import { showToast } from '../../composables/useNotifications'
import { $t } from '../../utils/i18n'

const props = withDefaults(defineProps<ImportDataProps & { show?: boolean }>(), {
  title: 'Import Data',
  buttonText: 'Import',
  buttonIcon: 'lucide:upload',
  batchSize: 200,
  show: false,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const isModalOpen = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const t = (key: string, fallback: string, args?: Record<string, any>) => {
  const res = args ? $t(key, args) : $t(key)
  return res !== key ? res : fallback
}

const displayTitle = computed(() => {
  if (props.titleI18n) {
    const res = $t(props.titleI18n)
    if (res !== props.titleI18n) return res
  }
  return props.title
})

const currentStep = ref(1)
const isProcessing = ref(false)

// Use shallowRef for massive arrays to avoid deep proxy rendering overhead
const importData = shallowRef<any[]>([])
const mappings = ref<Record<string, string>>({})
const importOptions = ref<ImportOptions>({
  existing: 'replace',
  new: 'create',
})
const importMethod = ref('')
const csvFile = shallowRef<File | null>(null)
const headers = shallowRef<string[]>([])
const preview = shallowRef<any[]>([])
const validationErrors = ref<string[]>([])

const initialProgress: ImportProgress = {
  total: 0,
  processed: 0,
  created: 0,
  updated: 0,
  skipped: 0,
  failed: 0,
  percentage: 0,
  errors: [],
}
const progress = ref<ImportProgress>({ ...initialProgress })

const resetState = () => {
  currentStep.value = 1
  isProcessing.value = false
  importData.value = []
  mappings.value = {}
  importOptions.value = { existing: 'replace', new: 'create' }
  importMethod.value = ''
  csvFile.value = null
  headers.value = []
  preview.value = []
  validationErrors.value = []
  progress.value = { ...initialProgress }
}

const validateMappings = () => {
  const errors: string[] = []
  const mappedFields: Record<string, string[]> = {}

  for (const header in mappings.value) {
    const mappedField = mappings.value[header]
    if (mappedField) {
      if (!mappedFields[mappedField]) mappedFields[mappedField] = []
      mappedFields[mappedField].push(header)
    }
  }

  for (const field in mappedFields) {
    if (mappedFields[field].length > 1) {
      errors.push(
        `Field "${field}" is mapped to multiple headers: ${mappedFields[field].join(', ')}`
      )
    }
  }

  const requiredFields = props.fields.filter((f) => f.required).map((f) => f.field)
  const mappedValues = Object.values(mappings.value)
  for (const req of requiredFields) {
    if (!mappedValues.includes(req)) {
      const fieldTitle = props.fields.find((f) => f.field === req)?.title || req
      errors.push(`Required field "${fieldTitle}" is not mapped.`)
    }
  }

  return errors
}

const nextStep = () => {
  if (currentStep.value === 2) {
    validationErrors.value = validateMappings()
    if (validationErrors.value.length > 0) return
  }
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1 && !isProcessing.value) {
    currentStep.value--
  }
}

const organizeData = (data: any[], maps: Record<string, string>) => {
  return data.map((item) => {
    const organizedItem: Record<string, any> = {}

    for (const originalKey in maps) {
      const mappedKey = maps[originalKey]
      if (!mappedKey) continue

      let val = item[originalKey]
      const fieldDef = props.fields.find((f) => f.field === mappedKey)

      if (
        (val === undefined || val === null || val === '') &&
        fieldDef?.defaultValue !== undefined
      ) {
        val = fieldDef.defaultValue
      }

      if (fieldDef?.expectedType) {
        if (fieldDef.expectedType === 'number') val = Number(val) || 0
        if (fieldDef.expectedType === 'boolean')
          val = Boolean(val && val.toString().toLowerCase() !== 'false' && val !== '0')
      }

      if (fieldDef?.onMatch) {
        val = fieldDef.onMatch(val)
      }

      if (mappedKey.includes('.')) {
        const parts = mappedKey.split('.')
        let current = organizedItem
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {}
          current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = val
      } else {
        organizedItem[mappedKey] = val
      }
    }
    return organizedItem
  })
}

const startImport = async () => {
  isProcessing.value = true
  nextStep()

  try {
    const organizedData = organizeData(importData.value, mappings.value)
    progress.value = { ...initialProgress, total: organizedData.length }

    const batches: any[][] = []
    for (let i = 0; i < organizedData.length; i += props.batchSize) {
      batches.push(organizedData.slice(i, i + props.batchSize))
    }

    const simInterval = setInterval(() => {
      if (progress.value.percentage < 90) {
        progress.value.percentage += Math.floor(Math.random() * 5) + 1
      }
    }, 1000)

    for (const batch of batches) {
      const result = await props.processBatch({
        data: batch,
        options: importOptions.value,
      })

      progress.value.processed += result.processed
      progress.value.created += result.created
      progress.value.updated += result.updated
      progress.value.skipped += result.skipped
      progress.value.failed += result.failed
      progress.value.errors = [...progress.value.errors, ...(result.errors || [])]
      progress.value.percentage = Math.min(
        99,
        Math.floor((progress.value.processed / progress.value.total) * 100)
      )
    }

    clearInterval(simInterval)
    progress.value.percentage = 100

    if (progress.value.failed === 0) {
      showToast(t('vlite.importData.success', 'Data imported successfully.'), 'success')
    } else {
      showToast(t('vlite.importData.partial', 'Import completed with some errors.'), 'warning')
    }

    if (props.onComplete) props.onComplete()
  } catch (error) {
    console.error(error)
    showToast(t('vlite.importData.error', 'A critical error occurred during import.'), 'error')
  } finally {
    isProcessing.value = false
  }
}

const availableFields = computed(() => {
  return props.fields.map((f) => ({ value: f.field, label: f.title, required: f.required }))
})

const timelineSteps = computed(() => [
  { id: 1, title: t('vlite.importData.stepUpload', 'Upload'), icon: 'lucide:upload' },
  { id: 2, title: t('vlite.importData.stepMapping', 'Mapping'), icon: 'lucide:git-pull-request' },
  { id: 3, title: t('vlite.importData.stepOptions', 'Options'), icon: 'lucide:settings-2' },
  { id: 4, title: t('vlite.importData.stepImport', 'Import'), icon: 'lucide:loader' },
])

const txtBack = computed(() => t('vlite.importData.btnBack', 'Back'))
const txtNext = computed(() => t('vlite.importData.btnNext', 'Next'))
const txtStart = computed(() => t('vlite.importData.btnStart', 'Start Import'))
const txtDone = computed(() => t('vlite.importData.btnDone', 'Done'))

// Update functions for shallowRefs
const updateImportMethod = (val: string) => {
  importMethod.value = val
}

const updateCsvFile = (val: File | null) => {
  csvFile.value = val
}

const updateMappings = (val: Record<string, string>) => {
  mappings.value = val
}

const updateHeaders = (val: string[]) => {
  headers.value = val
}

const updatePreview = (val: any[]) => {
  preview.value = val
}

const updateImportData = (val: any[]) => {
  importData.value = val
}
</script>

<template>
  <Modal
    v-model:show="isModalOpen"
    :title="displayTitle"
    max-width="sm:max-w-4xl"
    @close="resetState"
    :close-outside="!isProcessing">
    <template #trigger>
      <slot name="trigger">
        <Button v-if="!show" :text="buttonText" :icon="buttonIcon" variant="outline" />
      </slot>
    </template>

    <template #default="{ close }">
      <div class="px-2">
        <Timeline :steps="timelineSteps" :active-step="currentStep - 1" class="mb-13" />

        <div class="min-h-[300px]">
          <ImportStep1
            v-if="currentStep === 1"
            :importMethod="importMethod"
            :csvFile="csvFile"
            :mappings="mappings"
            :fields="fields"
            :headers="headers"
            :preview="preview"
            :importData="importData"
            @update:importMethod="updateImportMethod"
            @update:csvFile="updateCsvFile"
            @update:mappings="updateMappings"
            @update:headers="updateHeaders"
            @update:preview="updatePreview"
            @update:importData="updateImportData"
            @next="nextStep" />

          <ImportStep2
            v-else-if="currentStep === 2"
            :mappings="mappings"
            :headers="headers"
            :preview="preview"
            :availableFields="availableFields"
            @update:mappings="updateMappings" />

          <ImportStep3 v-else-if="currentStep === 3" :importOptions="importOptions" />

          <ImportStep4 v-else-if="currentStep === 4" :progress="progress" />
        </div>

        <div
          v-if="validationErrors.length > 0 && currentStep === 2"
          class="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="err in validationErrors" :key="err">{{ err }}</li>
          </ul>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-between w-full">
        <Button
          v-if="currentStep > 1 && currentStep < 4"
          variant="outline"
          @click="prevStep"
          :disabled="isProcessing"
          icon="lucide:arrow-left">
          {{ txtBack }}
        </Button>
        <div v-else></div>

        <Button
          v-if="currentStep < 3"
          variant="primary"
          @click="nextStep"
          :disabled="(currentStep === 1 && !importMethod) || isProcessing"
          icon-right="lucide:arrow-right">
          {{ txtNext }}
        </Button>

        <Button
          v-else-if="currentStep === 3"
          variant="primary"
          icon="lucide:play"
          @click="startImport"
          :loading="isProcessing">
          {{ txtStart }}
        </Button>

        <Button
          v-else-if="currentStep === 4 && progress.percentage >= 100"
          variant="primary"
          @click="close">
          {{ txtDone }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
