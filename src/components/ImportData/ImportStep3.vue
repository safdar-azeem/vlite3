<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import type { ImportOptions } from './types'
import { $t } from '../../utils/i18n'

const props = defineProps<{
  importOptions: ImportOptions
}>()

const txtOptions = computed(() => $t('vlite.importData.options', 'Import Options'))
const txtMatchFound = computed(() => $t('vlite.importData.matchFound', 'When a match is found'))
const txtMatchFoundDesc = computed(() => $t('vlite.importData.matchFoundDesc', 'Determine how to handle records that already exist in the system.'))
const txtNoMatch = computed(() => $t('vlite.importData.noMatch', 'When no match is found'))
const txtNoMatchDesc = computed(() => $t('vlite.importData.noMatchDesc', 'Determine how to handle completely new records.'))

</script>

<template>
  <div class="space-y-8">
    <div>
      <h4 class="font-medium text-lg mb-1">{{ txtOptions }}</h4>
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label
          class="relative rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md bg-background"
          :class="importOptions.existing === 'add' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/80'"
        >
          <input type="radio" value="add" v-model="importOptions.existing" class="absolute right-4 top-4 text-primary focus:ring-primary" />
          <div class="mb-2 text-foreground flex items-center gap-2">
            <Icon icon="lucide:plus-circle" class="w-5 h-5 text-primary" />
            <span class="font-medium">Add New</span>
          </div>
          <span class="text-xs text-muted-foreground block">Creates a duplicate record instead of overwriting.</span>
        </label>
        
        <label
          class="relative rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md bg-background"
          :class="importOptions.existing === 'replace' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/80'"
        >
          <input type="radio" value="replace" v-model="importOptions.existing" class="absolute right-4 top-4 text-primary focus:ring-primary" />
          <div class="mb-2 text-foreground flex items-center gap-2">
            <Icon icon="lucide:refresh-cw" class="w-5 h-5 text-primary" />
            <span class="font-medium">Update</span>
          </div>
          <span class="text-xs text-muted-foreground block">Overwrites existing fields with the imported data.</span>
        </label>
        
        <label
          class="relative rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md bg-background"
          :class="importOptions.existing === 'skip' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/80'"
        >
          <input type="radio" value="skip" v-model="importOptions.existing" class="absolute right-4 top-4 text-primary focus:ring-primary" />
          <div class="mb-2 text-foreground flex items-center gap-2">
            <Icon icon="lucide:skip-forward" class="w-5 h-5 text-primary" />
            <span class="font-medium">Skip</span>
          </div>
          <span class="text-xs text-muted-foreground block">Leaves existing records completely untouched.</span>
        </label>
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          class="relative rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md bg-background"
          :class="importOptions.new === 'create' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/80'"
        >
          <input type="radio" value="create" v-model="importOptions.new" class="absolute right-4 top-4 text-primary focus:ring-primary" />
          <div class="mb-2 text-foreground flex items-center gap-2">
            <Icon icon="lucide:check-circle-2" class="w-5 h-5 text-primary" />
            <span class="font-medium">Create New</span>
          </div>
          <span class="text-xs text-muted-foreground block">Creates a completely new record in the system.</span>
        </label>
        
        <label
          class="relative rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md bg-background"
          :class="importOptions.new === 'skip' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/80'"
        >
          <input type="radio" value="skip" v-model="importOptions.new" class="absolute right-4 top-4 text-primary focus:ring-primary" />
          <div class="mb-2 text-foreground flex items-center gap-2">
            <Icon icon="lucide:ban" class="w-5 h-5 text-primary" />
            <span class="font-medium">Skip</span>
          </div>
          <span class="text-xs text-muted-foreground block">Ignores the row if it does not already exist.</span>
        </label>
      </div>
    </div>
  </div>
</template>
