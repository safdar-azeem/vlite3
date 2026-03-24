<script setup lang="ts">
import { ref } from 'vue'
import { Price } from '@/components/Price'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'
import { updateConfig, useVLiteConfig } from '@/core'
import DemoSection from '../DemoSection.vue'
import sourceCode from './PriceDemo.vue?raw'
import { formatCurrency, getDefaultDateRange } from '@/utils'

const dynamicValue = ref(1234.56)
const config = useVLiteConfig()

const setGlobalCurrency = (currency: string) => {
  updateConfig({
    components: {
      price: {
        currency: currency,
      },
    },
  })
}
</script>

<template>
  <div class="space-y-10 max-w-5xl">
    <div>
      <h2 class="text-2xl font-bold mb-1">Price</h2>
      <p class="text-gray-500 text-sm">
        A component to render properly formatted currency values. It uses the globally configured
        currency from <code>createVLite</code> or falls back to USD, and can be overridden per
        component.
      </p>
    </div>

    ```
    <DemoSection title="Basic Usage (Default Global Config)" :code="sourceCode">
      <div class="flex items-center gap-8 text-2xl font-medium">
        <Price :value="100" />
        <Price :value="1250.5" />
        <Price :value="'99.99'" />
      </div>
    </DemoSection>

    <DemoSection title="Custom Currency Overrides (Local Props)" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-8 text-xl font-medium">
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground uppercase">Euro (EUR)</span>
          <Price :value="2500" currency="EUR" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground uppercase">British Pound (GBP)</span>
          <Price :value="2500" currency="GBP" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground uppercase">Japanese Yen (JPY)</span>
          <Price :value="2500" currency="JPY" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground uppercase">Pakistani Rupee (PKR)</span>
          <Price :value="250000" currency="PKR" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-xs text-muted-foreground uppercase">Indian Rupee (INR)</span>
          <Price :value="250000" currency="INR" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Dynamic Global Configuration" :code="sourceCode">
      <div class="space-y-6">
        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium"
            >Current Global Currency:
            <strong class="text-primary">{{
              config?.components?.price?.currency || 'USD'
            }}</strong></span
          >
          <p class="text-sm text-muted-foreground">
            Clicking these buttons uses <code>updateConfig()</code> to dynamically change the
            currency application-wide. The Price components below (without local currency props)
            will automatically react and update.
          </p>
        </div>

        <div class="flex gap-3 flex-wrap">
          <Button variant="outline" @click="setGlobalCurrency('USD')">Set USD</Button>
          <Button variant="outline" @click="setGlobalCurrency('EUR')">Set EUR</Button>
          <Button variant="outline" @click="setGlobalCurrency('GBP')">Set GBP</Button>
          <Button variant="outline" @click="setGlobalCurrency('JPY')">Set JPY</Button>
        </div>

        <div
          class="p-6 border border-border rounded-xl bg-card shadow-sm flex flex-col sm:flex-row items-center gap-8 text-2xl font-black text-foreground">
          <div class="flex flex-col gap-1 items-center sm:items-start">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
              >Base Plan</span
            >
            <Price :value="29" />
          </div>
          <div class="flex flex-col gap-1 items-center sm:items-start">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
              >Pro Plan</span
            >
            <Price :value="99" />
          </div>
          <div class="flex flex-col gap-1 items-center sm:items-start">
            <span class="text-xs font-semibold text-muted-foreground uppercase tracking-widest"
              >Enterprise</span
            >
            <Price :value="299" />
          </div>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Reactive Value" :code="sourceCode">
      <div class="space-y-4 max-w-sm">
        <Input type="number" v-model="dynamicValue" label="Enter Amount" />
        <div
          class="p-4 bg-muted/30 border border-border rounded-lg flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground">Total Cost:</span>
          <Price :value="dynamicValue" class="text-3xl font-black text-primary" />
        </div>
      </div>
    </DemoSection>

    ```
  </div>
</template>
