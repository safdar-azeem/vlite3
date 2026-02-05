<script setup lang="ts">
import Icon from '@/components/Icon.vue'

const semanticGroups = [
  {
    title: 'Backgrounds & Surfaces',
    tokens: [
      { name: 'background', cls: 'bg-background', text: 'text-foreground', desc: 'Page background' },
      { name: 'card', cls: 'bg-card', text: 'text-card-foreground', desc: 'Card / Modal / Panel' },
      { name: 'popover', cls: 'bg-popover', text: 'text-popover-foreground', desc: 'Dropdown / Tooltip' },
      { name: 'muted', cls: 'bg-muted', text: 'text-muted-foreground', desc: 'Subtle background' },
    ]
  },
  {
    title: 'Interactive & Accents',
    tokens: [
      { name: 'primary', cls: 'bg-primary', text: 'text-primary-foreground', desc: 'Primary Action' },
      { name: 'secondary', cls: 'bg-secondary', text: 'text-secondary-foreground', desc: 'Secondary Action' },
      { name: 'accent', cls: 'bg-accent', text: 'text-accent-foreground', desc: 'Hover / Active' },
      { name: 'destructive', cls: 'bg-destructive', text: 'text-destructive-foreground', desc: 'Destructive Action' },
    ]
  },
  {
    title: 'Feedback (Functional)',
    tokens: [
      { name: 'danger', cls: 'bg-danger', text: 'text-danger-fg', desc: 'Error / Critical' },
      { name: 'warning', cls: 'bg-warning', text: 'text-warning-fg', desc: 'Warning / Caution' },
      { name: 'info', cls: 'bg-info', text: 'text-info-fg', desc: 'Information' },
      { name: 'success', cls: 'bg-success', text: 'text-success-fg', desc: 'Success / Validation' },
    ]
  },
]

const borderTokens = [
  { name: 'border', cls: 'border-border', desc: 'Generic dividers' },
  { name: 'input', cls: 'border-input', desc: 'Form inputs' },
  { name: 'ring', cls: 'border-ring', desc: 'Focus rings' },
]
</script>

<template>
  <div class="space-y-12">
    <!-- Intro -->
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-foreground">Theme Colors</h2>
      <p class="text-muted-foreground mt-2">
        A visualization of the semantic color system. These tokens automatically adapt to light and dark modes.
      </p>
    </div>

    <!-- Semantic Groups -->
    <div v-for="group in semanticGroups" :key="group.title" class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground border-b border-border pb-2">{{ group.title }}</h3>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="token in group.tokens" :key="token.name" 
             class="group relative flex flex-col rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          
          <!-- Color Swatch -->
          <div :class="[token.cls, 'h-24 w-full flex items-center justify-center transition-colors']">
            <span :class="[token.text, 'font-medium text-sm px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm']">
              Aa
            </span>
          </div>

          <!-- Details -->
          <div class="p-4 bg-card">
            <div class="flex items-center justify-between">
              <code class="text-xs font-mono font-semibold text-primary">--{{ token.name }}</code>
              <Icon icon="lucide:copy" class="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
            </div>
            <p class="text-xs text-muted-foreground mt-1">{{ token.desc }}</p>
            
            <div class="mt-3 text-[10px] space-y-1 font-mono text-muted-foreground">
               <div class="flex justify-between">
                 <span>Class:</span>
                 <span class="text-foreground">{{ token.cls }}</span>
               </div>
               <div class="flex justify-between">
                 <span>Text:</span>
                 <span class="text-foreground">{{ token.text }}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Borders -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-foreground border-b border-border pb-2">Borders & Rings</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div v-for="token in borderTokens" :key="token.name" 
             class="flex items-center p-4 rounded-lg bg-card border border-border shadow-sm">
          <div :class="['w-12 h-12 rounded-md border-2 bg-background mr-4 flex-shrink-0', token.cls.replace('border-', 'border-')]"></div>
          <div>
            <code class="text-xs font-mono font-bold text-foreground">--{{ token.name }}</code>
            <p class="text-xs text-muted-foreground">{{ token.desc }}</p>
            <code class="text-[10px] text-muted-foreground mt-1 block">{{ token.cls }}</code>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
