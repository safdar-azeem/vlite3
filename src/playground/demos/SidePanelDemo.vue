<script setup lang="ts">
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import { ref } from 'vue'

const showRight = ref(false)
const showLeft = ref(false)
const showLg = ref(false)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">SidePanel</h2>
      <p class="text-gray-500">A panel that slides in from the edge of the screen.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Positions</h3>
      <div class="flex gap-4">
        <Button @click="showRight = true">Right (Default)</Button>
        <Button @click="showLeft = true" variant="outline">Left</Button>
      </div>

       <SidePanel v-model:show="showRight" title="Right Panel" position="right">
          <p class="text-gray-600">Content goes here...</p>
       </SidePanel>

       <SidePanel v-model:show="showLeft" title="Left Panel" position="left">
          <p class="text-gray-600">Content goes here...</p>
       </SidePanel>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Sizes</h3>
      <Button @click="showLg = true">Large Panel</Button>
      
      <SidePanel v-model:show="showLg" title="Large Panel" size="lg">
         <div class="space-y-4">
            <p v-for="i in 5" :key="i">Some substantial content requiring more width...</p>
         </div>
      </SidePanel>
    </section>
  </div>
</template>
