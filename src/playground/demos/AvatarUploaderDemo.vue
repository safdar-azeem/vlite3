<script setup lang="ts">
import { ref } from 'vue'
import { AvatarUploader } from '@/components/AvatarUploader'
import Icon from '@/components/Icon.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './AvatarUploaderDemo.vue?raw'

const avatar1 = ref<string | null>(null)
const avatar2 = ref<string | null>('https://i.pravatar.cc/300?img=12')
const avatar3 = ref<string | null>(null)
const avatar4 = ref<string | null>(null)

const handleChange = (label: string, val: any) => {
  console.log(`[${label}] Changed:`, val)
}

const handleError = (err: string) => {
  alert(err)
}
</script>

<template>
  <div class="space-y-8 p-4 max-w-3xl mx-auto">
    <div>
      <h2 class="text-2xl font-bold mb-2">AvatarUploader</h2>
      <p class="text-gray-500 mb-6">
        A premium avatar upload component with preview, overlay effects, and seamless file handling.
      </p>
    </div>

    <!-- 1. Sizes -->
    <DemoSection title="Sizes & Defaults" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-card flex items-end gap-6">
        <!-- Small -->
        <div class="flex flex-col items-center gap-2">
          <AvatarUploader
            v-model="avatar1"
            size="md"
            @change="(v) => handleChange('SM', v)"
            @error="handleError" />
          <span class="text-xs text-gray-400">MD</span>
        </div>

        <!-- Large -->
        <div class="flex flex-col items-center gap-2">
          <AvatarUploader
            v-model="avatar1"
            size="xl"
            @change="(v) => handleChange('XL', v)"
            @error="handleError" />
          <span class="text-xs text-gray-400">XL</span>
        </div>

        <!-- 2XL -->
        <div class="flex flex-col items-center gap-2">
          <AvatarUploader
            v-model="avatar1"
            size="2xl"
            @change="(v) => handleChange('2XL', v)"
            @error="handleError" />
          <span class="text-xs text-gray-400">2XL</span>
        </div>
      </div>
      <p class="text-sm text-gray-500">
        Note: All these share the same model, so updating one updates all.
      </p>
    </DemoSection>

    <!-- 2. Pre-filled & Shapes -->
    <DemoSection title="Pre-filled & Shapes" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-card flex gap-8">
        <div class="flex flex-col items-center gap-2">
          <label class="text-sm font-medium">Circle (Default)</label>
          <AvatarUploader v-model="avatar2" size="2xl" @change="(v) => handleChange('Circle', v)" />
        </div>

        <div class="flex flex-col items-center gap-2">
          <label class="text-sm font-medium">Rounded Square</label>
          <AvatarUploader
            v-model="avatar2"
            size="2xl"
            rounded="xl"
            @change="(v) => handleChange('Square', v)" />
        </div>
      </div>
    </DemoSection>

    <!-- 3. States -->
    <DemoSection title="States" :code="sourceCode">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border rounded-xl bg-card">
        <!-- Disabled -->
        <div class="flex flex-col items-center gap-2">
          <AvatarUploader v-model="avatar3" size="xl" disabled />
          <span class="text-xs text-gray-500">Disabled</span>
        </div>

        <!-- Read Only (Not Editable) -->
        <div class="flex flex-col items-center gap-2">
          <AvatarUploader v-model="avatar2" size="xl" :editable="false" />
          <span class="text-xs text-gray-500">Read Only</span>
        </div>

        <!-- Loading -->
        <div class="flex flex-col items-center gap-2">
          <AvatarUploader v-model="avatar4" size="xl" loading />
          <span class="text-xs text-gray-500">Loading</span>
        </div>
      </div>
    </DemoSection>

    <!-- 4. Max Size error handling -->
    <DemoSection title="Validation (Max 50KB)" :code="sourceCode">
      <div class="p-6 border rounded-xl bg-card">
        <AvatarUploader v-model="avatar1" size="xl" :max-size="50 * 1024" @error="handleError" />
        <p class="mt-2 text-xs text-gray-500">Try uploading a large image to see the alert.</p>
      </div>
    </DemoSection>
  </div>
</template>
