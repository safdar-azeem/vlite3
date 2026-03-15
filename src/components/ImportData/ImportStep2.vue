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
        <table class="import-table">
          <thead class="import-thead">
            <tr>
              <th class="import-th">{{ txtCsvHeader }}</th>
              <th class="import-th">{{ txtFieldMap }}</th>
              <th class="import-th">{{ txtPreview }}</th>
              <th class="import-th import-th-center">Ignore</th>
            </tr>
          </thead>
          <tbody class="import-tbody">
            <tr
              v-for="header in headers"
              :key="header"
              v-memo="[header, removedHeaders.includes(header), mappings[header], preview.map(r => r[header])]"
              :class="['import-tr', removedHeaders.includes(header) ? 'import-tr-ignored' : 'import-tr-active']">
              <td class="import-td-header">
                {{ header }}
              </td>
              <td class="import-td-dropdown">
                <Dropdown
                  v-if="!removedHeaders.includes(header)"
                  class="w-full"
                  :options="getDropdownOptions()"
                  :selected="mappings[header]"
                  placeholder="Select Field"
                  variant="outline"
                  showCaret
                  :btn-props="{ class: 'w-full justify-between' }"
                  @onSelect="mappings[header] = $event.value; emits('update:mappings', { ...mappings })" />
                <span v-else class="text-xs italic text-muted-foreground">Ignored</span>
              </td>
              <td class="import-td-preview">
                <div v-if="!removedHeaders.includes(header)" class="space-y-1">
                  <div v-for="(row, i) in preview" :key="i" class="truncate text-xs">
                    {{ String(row[header] || '').slice(0, 50) }}
                  </div>
                </div>
              </td>
              <td class="import-td-action">
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

<style scoped>
.import-table {
  width: 100%;
  font-size: 0.875rem;
  text-align: left;
  border-collapse: collapse;
}

.import-thead {
  font-size: 0.75rem;
  color: var(--color-muted-foreground, #6b7280);
  text-transform: uppercase;
  background-color: var(--color-muted, #f3f4f6);
  position: sticky;
  top: 0;
  z-index: 10;
}

.import-th {
  padding: 0.75rem 1rem;
  font-weight: 500;
}

.import-th-center {
  text-align: center;
  width: 4rem;
}

.import-tbody .import-tr {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.import-tbody .import-tr:last-child {
  border-bottom: none;
}

.import-tr-active {
  transition: background-color 0.2s ease-in-out;
}

.import-tr-active:hover {
  background-color: var(--color-muted, #f3f4f6);
  opacity: 0.85;
}

.import-tr-ignored {
  background-color: var(--color-muted, #f3f4f6);
  opacity: 0.6;
}

.import-td-header {
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: var(--color-foreground, #111827);
  white-space: nowrap;
}

.import-td-dropdown {
  padding: 0.5rem 1rem;
  min-width: 200px;
}

.import-td-preview {
  padding: 0.75rem 1rem;
  color: var(--color-muted-foreground, #6b7280);
  min-width: 200px;
  max-width: 300px;
}

.import-td-action {
  padding: 0.75rem 1rem;
  text-align: center;
  vertical-align: middle;
}
</style>
