<script setup lang="ts">
import { ref } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelSizes.vue?raw'

const showLg = ref(false)
</script>

<template>
  <DemoSection title="Sizes" :code="sourceCode">
    <Button @click="showLg = true">Large Panel</Button>

    <SidePanel v-model:show="showLg" title="Large Panel" size="lg">
      <div class="space-y-4">
        <p v-for="i in 5" :key="i">Some substantial content requiring more width...</p>
      </div>
    </SidePanel>
  </DemoSection>
</template>
