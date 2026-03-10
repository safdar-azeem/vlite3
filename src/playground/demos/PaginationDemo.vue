<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@/components/Pagination'
import DemoSection from '../DemoSection.vue'
import sourceCode from './PaginationDemo.vue?raw'

const page1 = ref(1)
const page2 = ref(5)
const page3 = ref(1)
const page4 = ref(1)
const page5 = ref(3)
const page6 = ref(3)
const page7 = ref(3)
const page8 = ref(3)
const page9 = ref(3)

const itemsPerPage = ref(10)

const handleChange = (label: string, val: number) => {
  console.log(`[${label}] Page changed to:`, val)
}

const handlePerPageChange = (val: number) => {
  console.log('[Full Featured] Items per page changed to:', val)
}
</script>

<template>
  <div class="space-y-8 p-4 max-w-4xl mx-auto">
    <div>
      <h2 class="text-2xl font-bold mb-2">Pagination Component</h2>
      <p class="text-gray-500 mb-6">
        Navigate through large lists of data with ease. Supports active variants (outline, solid,
        ghost) and rounded presets (none, sm, md, lg, full).
      </p>
    </div>

    <!-- 1. Full Featured -->
    <DemoSection title="Full Featured" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page5"
          v-model:items-per-page="itemsPerPage"
          :total-pages="10"
          show-items-per-page
          show-edges
          @change="(v) => handleChange('Full', v)"
          @change:items-per-page="handlePerPageChange" />
      </div>
    </DemoSection>

    <!-- 2. Active Variant: outline (default) -->
    <DemoSection title="Active Variant: outline (default)" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page6"
          :total-pages="10"
          active-variant="outline"
          @change="(v) => handleChange('Outline', v)" />
      </div>
    </DemoSection>

    <!-- 3. Active Variant: solid -->
    <DemoSection title="Active Variant: solid" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page7"
          :total-pages="10"
          active-variant="solid"
          @change="(v) => handleChange('Solid', v)" />
      </div>
    </DemoSection>

    <!-- 4. Active Variant: ghost -->
    <DemoSection title="Active Variant: ghost" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page8"
          :total-pages="10"
          active-variant="ghost"
          @change="(v) => handleChange('Ghost', v)" />
      </div>
    </DemoSection>

    <!-- 5. Rounded Variants -->
    <DemoSection title="Rounded Variants" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col gap-6">
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">none</span>
          <Pagination
            v-model:current-page="page9"
            :total-pages="8"
            active-variant="solid"
            rounded="none" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">sm</span>
          <Pagination
            v-model:current-page="page9"
            :total-pages="8"
            active-variant="solid"
            rounded="sm" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">md (default)</span>
          <Pagination
            v-model:current-page="page9"
            :total-pages="8"
            active-variant="solid"
            rounded="md" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">lg</span>
          <Pagination
            v-model:current-page="page9"
            :total-pages="8"
            active-variant="solid"
            rounded="lg" />
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xs text-muted-foreground font-medium uppercase tracking-wide">full</span>
          <Pagination
            v-model:current-page="page9"
            :total-pages="8"
            active-variant="solid"
            rounded="full" />
        </div>
      </div>
    </DemoSection>

    <!-- 6. Icon Navigation -->
    <DemoSection title="Icon Only Navigation" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page1"
          :total-pages="5"
          nav-type="icon"
          active-variant="solid"
          rounded="full"
          @change="(v) => handleChange('Icon Only', v)" />
      </div>
    </DemoSection>

    <!-- 7. Smart Truncation -->
    <DemoSection title="Smart Truncation" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page2"
          :total-pages="20"
          active-variant="solid"
          @change="(v) => handleChange('Truncation', v)" />
      </div>
    </DemoSection>

    <!-- 8. With Edges (First/Last) -->
    <DemoSection title="With First/Last Buttons" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination
          v-model:current-page="page3"
          :total-pages="15"
          show-edges
          active-variant="solid"
          rounded="lg"
          @change="(v) => handleChange('Edges', v)" />
      </div>
    </DemoSection>

    <!-- 9. Disabled -->
    <DemoSection title="Disabled State" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-gray-50/50 flex flex-col items-center gap-4">
        <Pagination v-model:current-page="page4" :total-pages="10" disabled />
      </div>
    </DemoSection>
  </div>
</template>
