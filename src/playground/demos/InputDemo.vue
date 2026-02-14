<script setup lang="ts">
import Input from '@/components/Input.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './InputDemo.vue?raw'

const val = ref('')
const password = ref('')
const lazyVal = ref('')
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Input</h2>
      <p class="text-gray-500">A fundamental component for handling user text input.</p>
    </div>

    <!-- Variants -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Outline (Default)" placeholder="Start typing..." variant="outline" />
        <Input label="Solid" placeholder="Start typing..." variant="solid" />
        <Input label="Outline Bottom" placeholder="Start typing..." variant="outline-b" />
        <Input label="Transparent" placeholder="Start typing..." variant="transparent" />
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Input label="Small" size="sm" placeholder="sm" />
        <Input label="Medium" size="md" placeholder="md" />
        <Input label="Large" size="lg" placeholder="lg" />
      </div>
    </DemoSection>

    <!-- States -->
    <DemoSection title="States" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Disabled" disabled placeholder="You cannot type here" />
        <Input
          label="Readonly (simulate with disabled for now if native not supp)"
          disabled
          model-value="Read only value" />
        <Input label="Error State" error="This field is required" placeholder="Invalid input" />
        <Input
          label="Success/Valid (Custom Icon)"
          icon-right="lucide:check-circle"
          placeholder="Valid input"
          class="text-green-600" />
      </div>
    </DemoSection>

    <!-- Icons & Loaders -->
    <DemoSection title="Icons & Addons" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Left Icon" icon="lucide:mail" placeholder="jon@example.com" />
        <Input label="Right Icon" icon-right="lucide:search" placeholder="Search..." />
        <Input label="Loading" loading placeholder="Validating..." />
        <Input label="Password Toggle" type="password" v-model="password" />
      </div>
    </DemoSection>

    <!-- Addons -->
    <DemoSection title="Text Addons" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Website" addon-left="https://" placeholder="example.com" />
        <Input label="Price" addon-left="$" addon-right=".00" placeholder="0.00" type="number" />
        <Input label="Email" addon-right="@builto.com" placeholder="username" />
      </div>
    </DemoSection>

    <!-- Label Positioning -->
    <DemoSection title="Label Positioning" :code="sourceCode">
      <div class="space-y-4 max-w-lg">
        <Input label="Top Label" label-position="top" placeholder="Default" />
        <Input label="Left Label" label-position="left" placeholder="Side mapped" />
        <Input label="Right Label" label-position="right" placeholder="Reversed" />
      </div>
    </DemoSection>
  </div>
</template>
