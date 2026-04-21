<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import Radio from '@/components/Radio.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import sourceCode from './RadioDemo.vue?raw'

const basicValue = ref('option1')
const sizeValue = ref('sm')
const colorValue = ref('primary')
const disabledValue = ref('option1')
const rowValue = ref('apple')
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-12 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Radio & Radio Group</h1>
      <p class="text-muted-foreground text-lg">
        A set of checkable buttons, known as radio buttons, where no more than one of the buttons can
        be checked at a time.
      </p>
    </div>

    <DemoSection title="Basic Usage" :code="sourceCode">
      <div class="p-6 border rounded-lg bg-card">
        <RadioGroup v-model="basicValue" name="basic-group">
          <Radio value="option1" label="Option 1" />
          <Radio value="option2" label="Option 2" />
          <Radio value="option3" label="Option 3" />
        </RadioGroup>
        <div class="mt-4 text-sm text-muted-foreground">
          Selected: {{ basicValue }}
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Sizes" :code="sourceCode">
      <div class="p-6 border rounded-lg bg-card flex flex-col gap-6">
        <RadioGroup v-model="sizeValue" name="size-group-xs" size="xs">
          <Radio value="xs" label="Extra Small (xs)" />
        </RadioGroup>
        
        <RadioGroup v-model="sizeValue" name="size-group-sm" size="sm">
          <Radio value="sm" label="Small (sm)" />
        </RadioGroup>

        <RadioGroup v-model="sizeValue" name="size-group-md" size="md">
          <Radio value="md" label="Medium (md)" />
        </RadioGroup>

        <RadioGroup v-model="sizeValue" name="size-group-lg" size="lg">
          <Radio value="lg" label="Large (lg)" />
        </RadioGroup>

        <RadioGroup v-model="sizeValue" name="size-group-xl" size="xl">
          <Radio value="xl" label="Extra Large (xl)" />
        </RadioGroup>
      </div>
    </DemoSection>

    <DemoSection title="Colors" :code="sourceCode">
      <div class="p-6 border rounded-lg bg-card space-y-6">
        <RadioGroup v-model="colorValue" name="colors-group" direction="row">
          <Radio value="primary" label="Primary" color="primary" />
          <Radio value="secondary" label="Secondary" color="secondary" />
          <Radio value="success" label="Success" color="success" />
          <Radio value="warning" label="Warning" color="warning" />
          <Radio value="danger" label="Danger" color="danger" />
          <Radio value="info" label="Info" color="info" />
        </RadioGroup>
      </div>
    </DemoSection>

    <DemoSection title="Horizontal Group" :code="sourceCode">
      <div class="p-6 border rounded-lg bg-card">
        <RadioGroup v-model="rowValue" name="fruits-group" direction="row">
          <Radio value="apple" label="Apple" />
          <Radio value="banana" label="Banana" />
          <Radio value="orange" label="Orange" />
          <Radio value="grape" label="Grape" />
        </RadioGroup>
      </div>
    </DemoSection>

    <DemoSection title="Disabled State" :code="sourceCode">
      <div class="p-6 border rounded-lg bg-card flex gap-12">
        <div>
          <h3 class="text-sm font-medium mb-3">Disabled Single Radio</h3>
          <RadioGroup v-model="disabledValue" name="disabled-single">
            <Radio value="option1" label="Available Option" />
            <Radio value="option2" label="Disabled Option" disabled />
          </RadioGroup>
        </div>
        <div>
          <h3 class="text-sm font-medium mb-3">Disabled Group</h3>
          <RadioGroup v-model="disabledValue" name="disabled-group" disabled>
            <Radio value="option1" label="Option 1" />
            <Radio value="option2" label="Option 2" />
          </RadioGroup>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
