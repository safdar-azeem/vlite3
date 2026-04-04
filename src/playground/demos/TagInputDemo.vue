<script setup lang="ts">
import { ref } from 'vue'
import { TagInput } from '@/components/TagInput'
import DemoSection from '../DemoSection.vue'
import sourceCode from './TagInputDemo.vue?raw'
import Label from '@/components/Label.vue'

const tags1 = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const tags2 = ref(['Vue', 'React', 'Angular'])
const tags3 = ref(['One', 'Two', 'Three'])
</script>

<template>
  <div class="space-y-10 p-4">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Tag Input</h2>
      <p class="text-gray-500">
        A component for inputting a list of string values, such as tags or keywords. Press Enter,
        comma, or the + button to add a tag.
      </p>
    </div>

    <DemoSection title="Default" :code="sourceCode">
      <div class="p-6 border border-border rounded-lg max-w-md w-full bg-body">
        <div class="mb-2">
          <Label> Add Tag (max.8) </Label>
        </div>
        <TagInput v-model="tags1" :maxTags="8" placeholder="Placeholder" />
      </div>
    </DemoSection>

    <DemoSection title="Variants" :code="sourceCode">
      <div class="grid gap-6 max-w-sm w-full">
        <div>
          <p class="text-sm font-medium mb-2 text-gray-600">Outline (Default)</p>
          <TagInput v-model="tags2" variant="outline" />
        </div>
        <div>
          <p class="text-sm font-medium mb-2 text-gray-600">Solid</p>
          <TagInput v-model="tags2" variant="solid" />
        </div>
        <div>
          <p class="text-sm font-medium mb-2 text-gray-600">Ghost</p>
          <TagInput v-model="tags2" variant="transparent" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Max Tags Limit" :code="sourceCode">
      <div class="p-4 border border-border rounded-lg max-w-sm w-full">
        <p class="text-sm text-gray-500 mb-4">Limited to 3 tags maximum.</p>
        <TagInput v-model="tags3" :maxTags="3" placeholder="Add tag..." />
        <p class="mt-4 text-sm text-gray-500">Value: {{ tags3 }}</p>
      </div>
    </DemoSection>
  </div>
</template>
