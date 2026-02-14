<script setup lang="ts">
import { ref } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelPositions.vue?raw'

const showRight = ref(false)
const showLeft = ref(false)
</script>

<template>
  <DemoSection title="Positions" :code="sourceCode">
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
  </DemoSection>
</template>
