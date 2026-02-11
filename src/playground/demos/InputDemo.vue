<script setup lang="ts">
import Input from '@/components/Input.vue'
import { ref } from 'vue'

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
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Variants</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Outline (Default)" placeholder="Start typing..." variant="outline" />
        <Input label="Solid" placeholder="Start typing..." variant="solid" />
        <Input label="Outline Bottom" placeholder="Start typing..." variant="outline-b" />
        <Input label="Transparent" placeholder="Start typing..." variant="transparent" />
      </div>
    </section>

    <!-- Sizes -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Sizes</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Input label="Small" size="sm" placeholder="sm" />
        <Input label="Medium" size="md" placeholder="md" />
        <Input label="Large" size="lg" placeholder="lg" />
      </div>
    </section>

    <!-- States -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">States</h3>
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
    </section>

    <!-- Icons & Loaders -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Icons & Addons</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Left Icon" icon="lucide:mail" placeholder="jon@example.com" />
        <Input label="Right Icon" icon-right="lucide:search" placeholder="Search..." />
        <Input label="Loading" loading placeholder="Validating..." />
        <Input label="Password Toggle" type="password" v-model="password" />
      </div>
    </section>

    <!-- Addons -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Text Addons</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Website" addon-left="https://" placeholder="example.com" />
        <Input label="Price" addon-left="$" addon-right=".00" placeholder="0.00" type="number" />
        <Input label="Email" addon-right="@builto.com" placeholder="username" />
      </div>
    </section>

    <!-- Label Positioning -->
    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Label Positioning</h3>
      <div class="space-y-4 max-w-lg">
        <Input label="Top Label" label-position="top" placeholder="Default" />
        <Input label="Left Label" label-position="left" placeholder="Side mapped" />
        <Input label="Right Label" label-position="right" placeholder="Reversed" />
      </div>
    </section>
  </div>
</template>
