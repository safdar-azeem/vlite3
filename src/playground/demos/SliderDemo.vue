<script setup lang="ts">
import Slider from '@/components/Slider.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './SliderDemo.vue?raw'

const val1 = ref(50)
const val2 = ref(75)
const val3 = ref(0)
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Slider</h2>
      <p class="text-gray-500">
        An input where the user selects a value from within a given range.
      </p>
    </div>

    <DemoSection title="Sizes" :code="sourceCode">

      <Slider label="Extra Small" size="xs" v-model="val1" />

      <Slider label="Small" size="sm" v-model="val1" />

      <Slider label="Medium (Default)" size="md" v-model="val1" />

      <Slider label="Large" size="lg" v-model="val1" />
    </DemoSection>

    <DemoSection title="Examples" :code="sourceCode">

      <Slider label="Standard (0-100)" v-model="val1" />

      <Slider label="Range (50-200)" :min="50" :max="200" v-model="val2" icon="lucide:maximize" />

      <Slider
        label="Bipolar / Balance (-50 to 50)"
        :min="-50"
        :max="50"
        v-model="val3"
        icon="lucide:scale" />

      <Slider label="Disabled" :model-value="30" disabled />
    </DemoSection>
  </div>
</template>
