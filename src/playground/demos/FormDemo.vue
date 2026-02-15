<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'

// Import new modular components
import FormBasic from './forms/FormBasic.vue'
import FormValidation from './forms/FormValidation.vue'
import FormAdvanced from './forms/FormAdvanced.vue'
import FormGrouped from './forms/FormGrouped.vue'
import FormMultiStep from './forms/FormMultiStep.vue'
import FormCustom from './forms/FormCustom.vue'
import FormUploads from './forms/FormUploads.vue'
import FormNumber from './forms/FormNumber.vue'
import FormAddons from './forms/FormAddons.vue'

const activeTab = ref('basic')

const tabs = [
  { id: 'basic', label: 'Basic Forms', icon: 'lucide:layout-list', component: FormBasic },
  { id: 'validation', label: 'Validation', icon: 'lucide:shield-check', component: FormValidation },
  { id: 'advanced', label: 'Advanced', icon: 'lucide:sparkles', component: FormAdvanced },
  { id: 'grouped', label: 'Grouped Forms', icon: 'lucide:layout-grid', component: FormGrouped },
  {
    id: 'multistep',
    label: 'Multi-Step',
    icon: 'tdesign:component-steps',
    component: FormMultiStep,
  },
  { id: 'custom', label: 'Custom Fields', icon: 'lucide:layers', component: FormCustom },
  { id: 'uploads', label: 'Uploads', icon: 'lucide:upload-cloud', component: FormUploads },
  { id: 'number', label: 'Number', icon: 'lucide:hash', component: FormNumber },
  { id: 'addons', label: 'Addons', icon: 'lucide:puzzle', component: FormAddons },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Form Component</h2>
      <p class="text-gray-600">
        A powerful schema-driven form system with validation, conditional fields, grouped layouts,
        and multi-step wizards.
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-border">
      <div class="flex flex-wrap gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2"
          :class="
            activeTab === tab.id
              ? 'border-primary text-primary bg-gray-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ">
          <Icon :icon="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="bg-white rounded-lg border border-border p-6 min-h-[400px]">
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2">
        <component :is="tabs.find((t) => t.id === activeTab)?.component" />
      </Transition>
    </div>
  </div>
</template>
