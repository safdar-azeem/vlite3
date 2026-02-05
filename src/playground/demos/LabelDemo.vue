<script setup lang="ts">
import Label from '@/components/Label.vue'
import Input from '@/components/Input.vue'
import CheckBox from '@/components/CheckBox.vue'
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Label</h2>
      <p class="text-gray-500">Renders an accessible label associated with controls.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Usage</h3>
      <div class="grid gap-4 max-w-sm">
         <div class="space-y-1">
            <Label for="email">Email address</Label>
            <Input id="email" placenolder="Enter email..." />
         </div>

         <div class="flex items-center gap-2">
            <CheckBox id="terms" v-model:checked="checked" />
            <Label for="terms" class="cursor-pointer">I accept the terms</Label>
         </div>
      </div>
    </section>
  </div>
</template>
