<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../Icon.vue'
import type { ImportProgress } from './types'
import { $t } from '../../utils/i18n'

const props = defineProps<{
  progress: ImportProgress
}>()

const t = (key: string, fallback: string, args?: Record<string, any>) => {
  const res = args ? $t(key, args) : $t(key)
  return res !== key ? res : fallback
}

const isImportComplete = computed(() => props.progress.percentage >= 100)
const showErrors = ref(false)

const txtProcessing = computed(() => t('vlite.importData.processing', 'Processing Data...'))
const txtDoNotClose = computed(() => t('vlite.importData.doNotClose', 'Please do not close this window.'))
const txtComplete = computed(() => t('vlite.importData.complete', 'Import Complete'))
const txtSuccessCount = computed(() => t('vlite.importData.successCount', `Successfully processed ${props.progress.total} records.`, { total: props.progress.total }))

const txtTotal = computed(() => t('vlite.importData.total', 'Total'))
const txtCreated = computed(() => t('vlite.importData.created', 'Created'))
const txtUpdated = computed(() => t('vlite.importData.updated', 'Updated'))
const txtSkipped = computed(() => t('vlite.importData.skipped', 'Skipped'))

const txtFailedCount = computed(() => t('vlite.importData.failedCount', `${props.progress.failed} records failed to import`, { count: props.progress.failed }))
const txtHideErrors = computed(() => t('vlite.importData.hideErrors', 'Hide Error Details'))
const txtViewErrors = computed(() => t('vlite.importData.viewErrors', 'View Error Details'))
const txtRow = computed(() => t('vlite.importData.row', 'Row'))
</script>

<template>
  <div class="space-y-6">
    <div v-if="!isImportComplete" class="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <div class="relative flex justify-center items-center pt-8 pb-4">
        <div class="relative w-36 h-36">
          <svg class="w-full h-full text-muted" viewBox="0 0 100 100">
            <circle stroke-width="6" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
          </svg>
          <svg class="w-full h-full absolute top-0 left-0 text-primary transition-all duration-300 ease-out" viewBox="0 0 100 100">
            <circle 
              stroke-width="6" 
              stroke="currentColor" 
              stroke-linecap="round" 
              fill="transparent" 
              r="42" cx="50" cy="50" 
              :stroke-dasharray="`${(progress.percentage * 263) / 100} 263`" 
              transform="rotate(-90 50 50)" 
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="text-3xl font-bold text-foreground">{{ progress.percentage }}%</div>
            <div class="text-xs text-muted-foreground mt-1">{{ progress.processed }} / {{ progress.total }}</div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4 space-y-1">
        <h3 class="text-lg font-medium text-foreground">{{ txtProcessing }}</h3>
        <p class="text-sm text-muted-foreground">{{ txtDoNotClose }}</p>
      </div>
    </div>

    <div v-else class="bg-card rounded-2xl p-8 border border-border shadow-sm">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
          <Icon icon="lucide:check" class="w-8 h-8 text-success" />
        </div>
        <h3 class="text-xl font-bold text-foreground">{{ txtComplete }}</h3>
        <p class="text-muted-foreground mt-1">{{ txtSuccessCount }}</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        <div class="bg-background rounded-xl p-4 border border-border flex flex-col items-center text-center">
          <span class="text-2xl font-bold text-foreground">{{ progress.total }}</span>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{{ txtTotal }}</span>
        </div>
        <div class="bg-background rounded-xl p-4 border border-border flex flex-col items-center text-center">
          <span class="text-2xl font-bold text-success">{{ progress.created }}</span>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{{ txtCreated }}</span>
        </div>
        <div class="bg-background rounded-xl p-4 border border-border flex flex-col items-center text-center">
          <span class="text-2xl font-bold text-primary">{{ progress.updated }}</span>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{{ txtUpdated }}</span>
        </div>
        <div class="bg-background rounded-xl p-4 border border-border flex flex-col items-center text-center">
          <span class="text-2xl font-bold text-warning">{{ progress.skipped }}</span>
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{{ txtSkipped }}</span>
        </div>
      </div>

      <div v-if="progress.failed > 0" class="mt-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
          <Icon icon="lucide:alert-triangle" class="w-4 h-4" />
          <span>{{ txtFailedCount }}</span>
        </div>
        
        <div v-if="progress.errors?.length" class="mt-4 text-left">
          <button @click="showErrors = !showErrors" class="text-sm font-medium text-destructive hover:underline inline-flex items-center gap-1">
            {{ showErrors ? txtHideErrors : txtViewErrors }}
            <Icon :icon="showErrors ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-4 h-4" />
          </button>
          
          <div v-if="showErrors" class="mt-3 max-h-48 overflow-y-auto bg-destructive/5 rounded-lg border border-destructive/10 p-3 text-sm">
            <ul class="space-y-2">
              <li v-for="(err, i) in progress.errors" :key="i" class="text-destructive/80 flex items-start gap-2">
                <span class="font-semibold shrink-0">{{ txtRow }} {{ err.record }}:</span>
                <span>{{ err.message }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
