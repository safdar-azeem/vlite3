<script setup lang="ts">
import { ref } from 'vue'
import { ChoiceBox, type ChoiceBoxOption, type ChoiceBoxVariant, type ChoiceBoxIndicatorType, type ChoiceBoxIndicatorPosition, type ChoiceBoxSize } from '@/components/ChoiceBox'
import Icon from '@/components/Icon.vue'
import CheckBox from '@/components/CheckBox.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ChoiceBoxDemo.vue?raw'

// Data Sources
const plans: ChoiceBoxOption[] = [
  { id: 'basic', title: 'Basic Plan', description: 'Perfect for starters. Includes basic features and community support.', icon: 'lucide:box', badge: 'Free' },
  { id: 'pro', title: 'Pro Plan', description: 'For growing businesses. Advanced analytics and priority support.', icon: 'lucide:zap', badge: 'Popular' },
  { id: 'enterprise', title: 'Enterprise', description: 'Unlimited possibilities for large scale organizations.', icon: 'lucide:building-2' },
]

const surveyOptions: ChoiceBoxOption[] = [
  { id: 'phone', title: 'Phone Verification', icon: 'lucide:smartphone' },
  { id: 'resume', title: 'Upload Resume', icon: 'lucide:file-text' },
  { id: 'auth', title: 'Work Authorization', icon: 'lucide:shield' },
  { id: 'interview', title: 'Domain Expert Interview', icon: 'lucide:monitor', badge: 'CORE' }
]

const settingsOptions: ChoiceBoxOption[] = [
  { id: 'face_id', title: 'Enable Face ID', description: 'Log in automatically with Face ID' },
  { id: 'notifications', title: 'Stay Notifications', description: 'Get room ready, upgrade, check-in updates.' },
  { id: 'promotions', title: 'Offers and Promotions', description: 'Get offers on nearby hotels, special promotions.' }
]

const filterOptions: ChoiceBoxOption[] = [
  { id: 'active', title: 'Active' },
  { id: 'pending', title: 'Pending' },
  { id: 'completed', title: 'Completed' },
  { id: 'cancelled', title: 'Cancelled' }
]

const genericOptions: ChoiceBoxOption[] = [
  { id: 'opt1', title: 'First Option', description: 'This is the first dynamic option.', icon: 'lucide:star' },
  { id: 'opt2', title: 'Second Option', description: 'This is the second dynamic option.', icon: 'lucide:moon' },
  { id: 'opt3', title: 'Third Option', description: 'This is the third dynamic option.', icon: 'lucide:sun' },
]

const todoOptions: ChoiceBoxOption[] = [
  { id: 'design', title: 'Client Review & Feedback', description: 'Crypto Wallet Redesign', icon: 'lucide:pen-tool' },
  { id: 'dev', title: 'API Integration', description: 'Connect payment gateways', icon: 'lucide:code' },
  { id: 'qa', title: 'Quality Assurance Testing', description: 'Run automated test suites', icon: 'lucide:check-circle' }
]

// State for standard demos
const selectedPlanV1 = ref<string>('pro')
const selectedPlanV3 = ref<string>('pro')
const selectedPlanV4 = ref<string>('pro')
const selectedSurveyList = ref<string>('resume')
const selectedSurveyGrid = ref<string>('resume')
const selectedSettings = ref<string[]>(['notifications'])
const selectedFilters = ref<string[]>(['active'])
const selectedTodos = ref<string[]>(['design'])

// Playground State
const playSelection = ref<string[]>(['opt1'])
const playVariant = ref<ChoiceBoxVariant>('1')
const playSize = ref<ChoiceBoxSize>('md')
const playIndicator = ref<ChoiceBoxIndicatorType>('default')
const playPosition = ref<ChoiceBoxIndicatorPosition>('top-right')
const playGrid = ref<number>(2)
const playMultiple = ref<boolean>(true)
const playLineThrough = ref<boolean>(false)

const handleChange = (label: string, val: any) => {
  console.log(`[${label}] Changed:`, val)
}
</script>

<template>
  <div class="space-y-12 p-4 max-w-6xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <h2 class="text-3xl font-bold tracking-tight text-foreground mb-3">ChoiceBox</h2>
      <p class="text-muted-foreground text-lg">
        A highly extendable selection component. Beautifully styled for forms, settings, surveys, and filtering. Supports multiple variants, indicators, flexible sizing, and todo-like behaviors.
      </p>
    </div>

    <div class="p-8 bg-card border border-border rounded-2xl shadow-sm mb-12">
      <div class="flex items-center gap-3 mb-6">
        <Icon icon="lucide:wrench" class="w-6 h-6 text-primary" />
        <h3 class="text-xl font-bold">Interactive Playground</h3>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-4 space-y-5 bg-muted/30 p-5 rounded-xl border border-border/50">
          <div>
            <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Variant Style</label>
            <select v-model="playVariant" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="1">Variant 1 (Cards - Subtle Border)</option>
              <option value="2">Variant 2 (List - Bottom Border)</option>
              <option value="3">Variant 3 (Filled - No Border)</option>
              <option value="4">Variant 4 (Outline - Heavy Border)</option>
              <option value="5">Variant 5 (Pills)</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Size</label>
            <select v-model="playSize" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="sm">Small (sm)</option>
              <option value="md">Medium (md)</option>
              <option value="lg">Large (lg)</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Indicator Type</label>
            <select v-model="playIndicator" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="none">None</option>
              <option value="default">Default (Check Icon)</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="switch">Switch</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Indicator Position</label>
            <select v-model="playPosition" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
          <div>
            <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Grid Columns (0 = Auto/Flex)</label>
            <select v-model="playGrid" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option :value="0">0 (Auto Flex Wrap)</option>
              <option :value="1">1 (Vertical Stack)</option>
              <option :value="2">2 Columns</option>
              <option :value="3">3 Columns</option>
            </select>
          </div>
          <div class="pt-2 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <CheckBox v-model="playMultiple" id="play-multiple" />
              <label for="play-multiple" class="text-sm font-medium cursor-pointer">Enable Multiple Selection</label>
            </div>
            <div class="flex items-center gap-2">
              <CheckBox v-model="playLineThrough" id="play-linethrough" />
              <label for="play-linethrough" class="text-sm font-medium cursor-pointer">Line-through on Select</label>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 p-6 bg-background rounded-xl border border-border/50 flex flex-col justify-center min-h-[300px]">
          <ChoiceBox
            v-model="playSelection"
            :options="genericOptions"
            :variant="playVariant"
            :size="playSize"
            :indicatorType="playIndicator"
            :indicatorPosition="playPosition"
            :grid="playGrid"
            :multiple="playMultiple"
            :lineThroughOnSelect="playLineThrough"
          />
        </div>
      </div>
    </div>

    <div class="grid gap-10">
      
      <DemoSection title="Card Visual Variants (1 vs 3 vs 4)" :code="sourceCode">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-muted-foreground">Variant 1 (Standard Card)</h4>
            <ChoiceBox v-model="selectedPlanV1" :options="[plans[1]]" variant="1" :grid="1" indicatorPosition="right" />
          </div>
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-muted-foreground">Variant 3 (Filled / No Border)</h4>
            <ChoiceBox v-model="selectedPlanV3" :options="[plans[1]]" variant="3" :grid="1" indicatorPosition="right" />
          </div>
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-muted-foreground">Variant 4 (Bold Outline)</h4>
            <ChoiceBox v-model="selectedPlanV4" :options="[plans[1]]" variant="4" :grid="1" indicatorPosition="right" />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Todo List / Task Manager (lineThroughOnSelect)" :code="sourceCode">
        <div class="p-8 border border-border/60 rounded-2xl bg-card shadow-sm max-w-xl mx-auto">
          <ChoiceBox
            v-model="selectedTodos"
            :options="todoOptions"
            multiple
            variant="2"
            size="md"
            indicatorType="default"
            indicatorPosition="right"
            lineThroughOnSelect
            :gap="0"
            @change="(v) => handleChange('Todos', v)"
          />
        </div>
      </DemoSection>

      <DemoSection title="Survey List (Variant 2, lg, right radio)" :code="sourceCode">
        <div class="p-8 border border-border/60 rounded-2xl bg-card shadow-sm flex justify-center">
          <div class="bg-background border border-border rounded-xl overflow-hidden shadow-sm w-full max-w-xl">
            <ChoiceBox
              v-model="selectedSurveyList"
              :options="surveyOptions"
              variant="2"
              size="lg"
              indicatorType="radio"
              indicatorPosition="right"
              :gap="0"
              @change="(v) => handleChange('Survey', v)"
            />
          </div>
        </div>
      </DemoSection>

      <DemoSection title="Settings Panel (Variant 3, sm, right switch)" :code="sourceCode">
        <div class="p-8 border border-border/60 rounded-2xl bg-card shadow-sm max-w-2xl mx-auto">
          <ChoiceBox
            v-model="selectedSettings"
            :options="settingsOptions"
            multiple
            variant="3"
            size="sm"
            indicatorType="switch"
            indicatorPosition="right"
            :grid="1"
            :gap="3"
            @change="(v) => handleChange('Settings', v)"
          />
        </div>
      </DemoSection>

      <DemoSection title="Filter Pills (Variant 5, sm, left checkbox)" :code="sourceCode">
        <div class="p-8 border border-border/60 rounded-2xl bg-card shadow-sm flex justify-center">
          <ChoiceBox
            v-model="selectedFilters"
            :options="filterOptions"
            multiple
            variant="5"
            size="sm"
            indicatorType="checkbox"
            indicatorPosition="left"
            :grid="0" 
            :gap="3"
            @change="(v) => handleChange('Filters', v)"
          />
        </div>
      </DemoSection>

      <DemoSection title="Custom Template / Visual Slot (Variant 4, lg)" :code="sourceCode">
        <div class="p-8 border border-border/60 rounded-2xl bg-card shadow-sm">
          <ChoiceBox
            v-model="selectedSurveyGrid"
            :options="surveyOptions"
            variant="4"
            size="lg"
            indicatorType="none"
            :grid="4"
          >
            <template #option="{ option, selected }">
              <div class="flex flex-col items-center justify-center w-full py-4 text-center">
                <div class="p-4 rounded-full mb-4 transition-all duration-300" :class="selected ? 'bg-primary/10 text-primary scale-110' : 'bg-muted text-muted-foreground'">
                  <Icon :icon="option.icon" class="w-8 h-8" />
                </div>
                <span class="font-semibold text-sm transition-colors" :class="selected ? 'text-primary' : 'text-foreground'">
                  {{ option.title }}
                </span>
                <span v-if="option.badge" class="mt-2 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full" :class="selected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'">
                  {{ option.badge }}
                </span>
              </div>
            </template>
          </ChoiceBox>
        </div>
      </DemoSection>
    </div>
  </div>
</template>
