<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown/Dropdown.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './InputDemo.vue?raw'

const val = ref('')
const password = ref('')
const searchVal = ref('')
const copyVal = ref('npm install vlite3')
const selectedProtocol = ref('https://')
const protocols = [
  { label: 'https://', value: 'https://' },
  { label: 'http://', value: 'http://' },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Input</h2>
      <p class="text-gray-500">
        A fundamental component for handling user text input with advanced addon support.
      </p>
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

    <DemoSection title="Sizes" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Input label="Small" size="sm" placeholder="sm" />
        <Input label="Medium" size="md" placeholder="md" />
        <Input label="Large" size="lg" placeholder="lg" />
      </div>
    </DemoSection>

    <DemoSection title="States" :code="sourceCode">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Disabled" disabled placeholder="You cannot type here" />
        <Input label="Error State" error="This field is required" placeholder="Invalid input" />
        <Input label="Loading" loading placeholder="Validating..." />
        <Input label="With Icon" icon="lucide:mail" placeholder="jon@example.com" />
      </div>
    </DemoSection>

    <DemoSection title="Label Positioning" :code="sourceCode">
      <div class="space-y-4 max-w-lg">
        <Input label="Top Label" label-position="top" placeholder="Default" />
        <Input label="Left Label" label-position="left" placeholder="Side mapped" />
        <Input label="Right Label" label-position="right" placeholder="Reversed" />
      </div>
    </DemoSection>

    <DemoSection title="Input Groups & Addons" :code="sourceCode">
      <div class="space-y-6">
        <p class="text-sm text-gray-500">
          Use the <code>addon-left</code> and <code>addon-right</code> slots to attach buttons,
          dropdowns, or static text.
        </p>

        <Input placeholder="Find something..." v-model="searchVal">
          <template #addon-right>
            <Button variant="primary" icon="lucide:search">Search</Button>
          </template>
        </Input>

        <Input placeholder="example.com">
          <template #addon-left>
            <Dropdown v-model="selectedProtocol" :options="protocols" class="w-24">
              <template #trigger="{ selectedLabel }">
                <Button variant="outline">
                  {{ selectedLabel }}
                </Button>
              </template>
            </Dropdown>
          </template>
        </Input>

        <Input v-model="copyVal" readonly>
          <template #addon-left>
            <Button variant="outline"> Command </Button>
          </template>
          <template #addon-right>
            <Button variant="outline" icon="lucide:copy"> Copy </Button>
          </template>
        </Input>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Price" addon-left="$" addon-right=".00" placeholder="0.00" type="number" />
          <Input label="Email" addon-right="@builto.com" placeholder="username" />
        </div>
      </div>
    </DemoSection>
  </div>
</template>
