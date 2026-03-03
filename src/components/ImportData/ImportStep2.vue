<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '../Icon.vue'
import { Dropdown } from '../Dropdown'
import CheckBox from '../CheckBox.vue'
import { $t } from '../../utils/i18n'

const props = defineProps<{
  headers: string[]
  preview: any[]
  mappings: Record<string, string>
  availableFields: { value: string; label: string; required?: boolean }[]
}>()

const emits = defineEmits(['next', 'prev', 'update:mappings'])
const removedHeaders = ref<string[]>([])

const t = (key: string, fallback: string) => {
  const res = $t(key)
  return res !== key ? res : fallback
}

const headersWithMapping = computed(() => {
  return props.headers.filter((header) => props.mappings[header] !== '')
})

const toggleHeaderMapping = (header: string) => {
  const updatedMappings = { ...props.mappings }
  const isRemoved = removedHeaders.value.includes(header)

  if (isRemoved) {
    removedHeaders.value = removedHeaders.value.filter((h) => h !== header)
  } else {
    removedHeaders.value.push(header)
  }

  if (updatedMappings[header] !== '') {
    updatedMappings[header] = ''
  }

  emits('update:mappings', updatedMappings)
}

const getDropdownOptions = () => {
  return props.availableFields.map((f) => ({
    label: f.required ? `${f.label} *` : f.label,
    value: f.value,
  }))
}

const txtAssign = computed(() => t('vlite.importData.assignFields', 'Assign Fields'))
const txtAssignDesc = computed(() => t('vlite.importData.assignDesc', 'Match your CSV columns to the correct system fields.'))
const txtCsvHeader = computed(() => t('vlite.importData.csvHeader', 'CSV Header'))
const txtFieldMap = computed(() => t('vlite.importData.fieldMapping', 'System Field'))
const txtPreview = computed(() => t('vlite.importData.preview', 'Data Preview'))
const txtNoHeaders = computed(() => t('vlite.importData.noHeaders', 'No headers mapped. Data will not be imported properly.'))
</script>

<template>
  <div class="space-y-6">
    <div>
      <h4 class="font-medium text-lg mb-1">{{ txtAssign }}</h4>
      <p class="text-sm text-muted-foreground">{{ txtAssignDesc }}</p>
    </div>

    <div class="border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto max-h-[400px]">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-muted-foreground uppercase bg-muted sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 font-medium">{{ txtCsvHeader }}</th>
              <th class="px-4 py-3 font-medium">{{ txtFieldMap }}</th>
              <th class="px-4 py-3 font-medium">{{ txtPreview }}</th>
              <th class="px-4 py-3 font-medium text-center w-16">Ignore</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="header in headers"
              :key="header"
              :class="removedHeaders.includes(header) ? 'bg-muted/30 opacity-60' : 'hover:bg-muted/10'">
              <td class="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                {{ header }}
              </td>
              <td class="px-4 py-2 min-w-[200px]">
                <Dropdown
                  v-if="!removedHeaders.includes(header)"
                  class="w-full"
                  :options="getDropdownOptions()"
                  :selected="mappings[header]"
                  placeholder="Select Field"
                  variant="outline"
                  showCaret
                  :btn-props="{ class: 'w-full justify-between' }"
                  @onSelect="mappings[header] = $event.value" />
                <span v-else class="text-xs italic text-muted-foreground">Ignored</span>
              </td>
              <td class="px-4 py-3 text-muted-foreground min-w-[200px] max-w-[300px]">
                <div v-if="!removedHeaders.includes(header)" class="space-y-1">
                  <div v-for="(row, i) in preview" :key="i" class="truncate text-xs">
                    {{ String(row[header] || '').slice(0, 50) }}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-center align-middle">
                <div class="flex justify-center items-center h-full">
                  <CheckBox
                    :checked="removedHeaders.includes(header)"
                    @update:checked="toggleHeaderMapping(header)"
                    size="sm"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="headersWithMapping.length === 0"
      class="text-center text-sm text-warning font-medium p-4 bg-warning/10 rounded-lg border border-warning/20">
      {{ txtNoHeaders }}
    </div>
  </div>
</template>
