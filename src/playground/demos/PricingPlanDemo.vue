<script setup lang="ts">
import { ref } from 'vue'
import { PricingPlan } from '@/components/PricingPlan'
import type { PricingPlanItemSchema } from '@/components/PricingPlan/types'
import DemoSection from '../DemoSection.vue'
import sourceCode from './PricingPlanDemo.vue?raw'

const selectedPlan = ref<string | number>('pro')
const selectedEnterprise = ref<string | number>('ent-2')

const plans: PricingPlanItemSchema[] = [
  {
    id: 'basic',
    title: 'Basic',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started.',
    buttonText: 'Start for Free',
    features: [
      '5 Projects',
      'Basic Analytics',
      { text: 'Custom Domain', included: false },
      { text: 'Priority Support', included: false },
    ],
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Best for growing teams.',
    popular: true,
    buttonText: 'Get Started',
    features: [
      'Unlimited Projects',
      'Advanced Analytics',
      'Custom Domain',
      { text: 'Priority Support', included: false },
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large scale organizations.',
    buttonText: 'Contact Sales',
    features: ['Unlimited Projects', 'Advanced Analytics', 'Custom Domain', 'Priority Support'],
  },
]

const enterprisePlans: PricingPlanItemSchema[] = [
  {
    id: 'ent-1',
    title: 'Startup',
    price: '$499',
    features: ['All Pro Features', 'Dedicated Support'],
  },
  {
    id: 'ent-2',
    title: 'Scale',
    price: '$999',
    recommended: true,
    variant: 'solid',
    features: ['All Startup Features', 'SLA', 'Account Manager'],
  },
]
</script>

<template>
  <div class="space-y-12 p-10">
    <!-- Outline Variant (Default) -->
    <DemoSection title="Pricing Plans (Outline)" :code="sourceCode">
      <h2 class="text-2xl font-bold mb-6">Pricing Plans (Outline)</h2>
      <div class="bg-background p-6 rounded-xl border">
        <PricingPlan v-model="selectedPlan" :items="plans" variant="outline" />

        <div class="mt-4 p-4 bg-muted rounded">
          Selected Plan ID: <strong>{{ selectedPlan }}</strong>
        </div>
      </div>
    </DemoSection>

    <!-- Solid Variant -->
    <DemoSection title="Pricing Plans (Solid & Custom Grid)" :code="sourceCode">
      <h2 class="text-2xl font-bold mb-6">Pricing Plans (Solid & Custom Grid)</h2>
      <div class="bg-background p-6 rounded-xl border">
        <PricingPlan
          v-model="selectedEnterprise"
          :items="enterprisePlans"
          variant="solid"
          :columns="2" />
        <div class="mt-4 p-4 bg-muted rounded">
          Selected Enterprise ID: <strong>{{ selectedEnterprise }}</strong>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
