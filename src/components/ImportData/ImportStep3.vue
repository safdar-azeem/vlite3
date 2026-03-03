<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { ChoiceBox } from '../ChoiceBox'
import type { ImportOptions } from './types'
import { $t } from '../../utils/i18n'

const props = defineProps<{
  importOptions: ImportOptions
}>()

const t = (key: string, fallback: string) => {
  const res = $t(key)
  return res !== key ? res : fallback
}

const txtOptions = computed(() => t('vlite.importData.options', 'Import Options'))
const txtMatchFound = computed(() => t('vlite.importData.matchFound', 'When a match is found'))
const txtMatchFoundDesc = computed(() => t('vlite.importData.matchFoundDesc', 'Determine how to handle records that already exist in the system.'))
const txtNoMatch = computed(() => t('vlite.importData.noMatch', 'When no match is found'))
const txtNoMatchDesc = computed(() => t('vlite.importData.noMatchDesc', 'Determine how to handle completely new records.'))

const existingOptions = computed(() => [
  {
    id: 'add',
    title: t('vlite.importData.optAddTitle', 'Add New'),
    description: t('vlite.importData.optAddDesc', 'Creates a duplicate record instead of overwriting.'),
    icon: 'lucide:plus-circle'
  },
  {
    id: 'replace',
    title: t('vlite.importData.optReplaceTitle', 'Update'),
    description: t('vlite.importData.optReplaceDesc', 'Overwrites existing fields with the imported data.'),
    icon: 'lucide:refresh-cw'
  },
  {
    id: 'skip',
    title: t('vlite.importData.optSkipTitle', 'Skip'),
    description: t('vlite.importData.optSkipDesc', 'Leaves existing records completely untouched.'),
    icon: 'lucide:skip-forward'
  }
])

const newOptions = computed(() => [
  {
    id: 'create',
    title: t('vlite.importData.optCreateTitle', 'Create New'),
    description: t('vlite.importData.optCreateDesc', 'Creates a completely new record in the system.'),
    icon: 'lucide:check-circle-2'
  },
  {
    id: 'skip',
    title: t('vlite.importData.optSkipNewTitle', 'Skip'),
    description: t('vlite.importData.optSkipNewDesc', 'Ignores the row if it does not already exist.'),
    icon: 'lucide:ban'
  }
])
</script>

<template>
  <div class="space-y-8">
    <div>
      <div>
        <h5 class="font-medium text-md mb-2">{{ txtOptions }}</h5>
      </div>

      <div class="bg-card rounded-xl p-5 border border-border shadow-sm">
        <div class="flex items-center mb-6">
          <div class="bg-primary/10 p-2.5 rounded-lg mr-4 text-primary shrink-0">
            <Icon icon="lucide:git-compare" class="w-6 h-6" />
          </div>
          <div>
            <h6 class="font-semibold text-foreground text-base">{{ txtMatchFound }}</h6>
            <p class="text-sm text-muted-foreground">{{ txtMatchFoundDesc }}</p>
          </div>
        </div>

        <ChoiceBox v-model="importOptions.existing" :options="existingOptions" :grid="3" />
      </div>
    </div>

    <div class="bg-card rounded-xl p-5 border border-border shadow-sm">
      <div class="flex items-center mb-6">
        <div class="bg-primary/10 p-2.5 rounded-lg mr-4 text-primary shrink-0">
          <Icon icon="lucide:file-plus" class="w-6 h-6" />
        </div>
        <div>
          <h6 class="font-semibold text-foreground text-base">{{ txtNoMatch }}</h6>
          <p class="text-sm text-muted-foreground">{{ txtNoMatchDesc }}</p>
        </div>
      </div>

      <ChoiceBox v-model="importOptions.new" :options="newOptions" :grid="2" />
    </div>
  </div>
</template>
